import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const getPaymentAmount = (session: Stripe.Checkout.Session): number => {
  const amountInCents = session.amount_total ?? 0;
  const amount = amountInCents / 100;
  return amount;
};

// ─── Handler: checkout.session.completed ────
export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;
  const tenantId = session.metadata?.tenantId;
  const stripeSessionId = session.id;
  const stripePaymentIntentId = session.payment_intent as string;

  if (!rentalRequestId || !tenantId) {
    console.log("Webhook: Missing metadata values for checkout session");
    return;
  }
  const amount = getPaymentAmount(session);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { rentalRequestId },
      data: {
        status: "COMPLETED",
        stripePaymentIntentId,
        transactionId: stripeSessionId,
        paidAt: new Date(),
        amount,
      },
    });

    await tx.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status: "ACTIVE" },
    });
    const rentalRequest = await tx.rentalRequest.findUnique({
      where: { id: rentalRequestId },
      select: { propertyId: true },
    });

    if (rentalRequest) {
      await tx.property.update({
        where: { id: rentalRequest.propertyId },
        data: { status: "RENTED" },
      });
    }
  });

};

export const handlePaymentRefunded = async (charge: Stripe.Charge) => {
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.log("Webhook: Missing paymentIntentId for refund event");
    return;
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (!existingPayment) {
    console.log(
      `Webhook: No payment found for paymentIntentId: ${paymentIntentId}`
    );
    return;
  }

  await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntentId },
    data: {
      status: "REFUNDED",
    },
  });

  await prisma.rentalRequest.update({
    where: { id: existingPayment.rentalRequestId },
    data: { status: "APPROVED" },
  });
};

export const handlePaymentFailed = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const paymentIntentId = paymentIntent.id;

  const existingPayment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (!existingPayment) {
    console.log(
      `Webhook: No payment record found for failed intent: ${paymentIntentId}`
    );
    return;
  }

  await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { status: "FAILED" },
  });

  console.log(`Webhook: Payment failed for intent: ${paymentIntentId}`);
};