import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import AppError from "../../utils/AppError";
import {
  handleCheckoutCompleted,
  handlePaymentFailed,
  handlePaymentRefunded,
} from "./payment.utils";

const createCheckoutSession = async (
  rentalRequestId: string,
  tenantId: string,
) => {
  const { payment, checkoutUrl, sessionId } = await prisma.$transaction(
    async (tx) => {
      const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
        where: { id: rentalRequestId },
        include: {
          property: {
            select: {
              title: true,
              address: true,
              rentAmount: true,
            },
          },
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payment: true,
        },
      });

      if (rentalRequest.tenantId !== tenantId) {
        throw new AppError(
          403,
          "Forbidden",
          "You can only pay for your own rental requests",
        );
      }

      if (
        rentalRequest.payment &&
        rentalRequest.payment.status === "COMPLETED"
      ) {
        throw new AppError(
          409,
          "Conflict",
          "Payment has already been completed for this rental",
        );
      }


      if (rentalRequest.status !== "APPROVED") {
        throw new AppError(
          400,
          "Bad Request",
          `Payment is only available for approved requests. Current status: ${rentalRequest.status}`,
        );
      }


      const totalAmount =
        rentalRequest.property.rentAmount * rentalRequest.duration;

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: rentalRequest.property.title,
                description: `Rental for ${rentalRequest.duration} month(s) - ${rentalRequest.property.address}`,
              },
              unit_amount: Math.round(totalAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: rentalRequest.tenant.email,
        payment_method_types: ["card"],
        success_url: `${config.appUrl}/payments/checkout/success`,
        cancel_url: `${config.appUrl}/payments/checkout/cancel`,
        metadata: {
          rentalRequestId,
          tenantId,
        },
      });

      const paymentRecord = await tx.payment.upsert({
        where: { rentalRequestId },
        create: {
          rentalRequestId,
          tenantId,
          amount: totalAmount,
          currency: "usd",
          status: "PENDING",
          provider: "STRIPE",
          stripeSessionId: session.id,
        },
        update: {
          stripeSessionId: session.id,
          status: "PENDING",
          amount: totalAmount,
          paidAt: null,
          transactionId: null,
        },
      });

      return {
        payment: paymentRecord,
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    },
  );

  return {
    message:
      "Payment session created. Redirect to checkoutUrl to complete payment.",
    data: {
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        provider: payment.provider,
        stripeSessionId: payment.stripeSessionId,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      },
      checkoutUrl: checkoutUrl,
    },
  };
};

// ─── Handle Webhook ────
const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripeWebhookSecret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case "charge.refunded":
      await handlePaymentRefunded(event.data.object as Stripe.Charge);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    default:
      console.log(`No events matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getUserPayments = async (tenantId: string) => {
  const payments = await prisma.payment.findMany({
    where: { tenantId },
    include: {
      rentalRequest: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
              rentAmount: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return payments;
};

const getPaymentById = async (
  paymentId: string,
  userId: string,
  userRole: string,
) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
              landlordId: true,
            },
          },
        },
      },
    },
  });


  const isOwner = payment.tenantId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new AppError(403, "Forbidden", "Access denied");
  }

  return payment;
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
  getUserPayments,
  getPaymentById,
};
