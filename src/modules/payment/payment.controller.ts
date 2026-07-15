import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createCheckoutSession = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const { rentalRequestId } = req.body;

    const result = await paymentService.createCheckoutSession(
      rentalRequestId,
      tenantId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: result.data,
    });
  }
);

// ─── Handle Webhook ───
const handleWebhook = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(event, signature as string);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Webhook triggered successfully",
      data: null,
    });
  }
);

const getUserPayments = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;

    const result = await paymentService.getUserPayments(
      tenantId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  }
);

const getPaymentById = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;

    const result = await paymentService.getPaymentById(
      id as string,
      userId as string,
      userRole as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });
  }
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getUserPayments,
  getPaymentById,
};