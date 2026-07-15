import { Request, Response, Router } from "express";
import express from "express";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../../generated/prisma/enums";
import httpStatus from "http-status"
import { sendResponse } from "../../utils/sendResponse";

const router = Router();

router.post(
  "/webhook",
  paymentController.handleWebhook
);

router.post(
  "/checkout",
  auth(UserRole.TENANT),
  paymentController.createCheckoutSession
);

router.post("/checkout/success", (req: Request, res: Response) => {
  res.json({
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment Completed Successfully",
        data: null
    })
});
router.post("/checkout/cancel", (req: Request, res: Response) => {
  sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Payment Cancelled",
        data: null
    })
});

router.get(
  "/",
  auth(UserRole.TENANT, UserRole.ADMIN),
  paymentController.getUserPayments
);

router.get(
  "/:id",
  auth(UserRole.TENANT, UserRole.ADMIN),
  paymentController.getPaymentById
);

export const paymentRouter = router;