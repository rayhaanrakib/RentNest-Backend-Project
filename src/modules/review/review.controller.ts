import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import httpStatus from "http-status";
import { ICreateReviewPayload } from "./review.interface";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";

const createReview = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user!.id;
    const review = await reviewService.createReviewDB(
      req.body as ICreateReviewPayload,
      tenantId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review submitted successfully",
      data: review,
    });
  },
);

export const reviewController = { createReview };
