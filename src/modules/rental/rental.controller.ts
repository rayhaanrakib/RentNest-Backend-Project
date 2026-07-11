import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { ICreateRentalPayload, IRentalUpdateStatus } from "./rental.interface";
import { rentalService } from "./rental.service";
import httpStatus from "http-status-codes";
import { validateCreateRental } from "./rental.validation";
import { tryCatchAsync } from "../../utils/tryCatchAsync";

// Tenant Part //
const createRentalRequest = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    validateCreateRental(req.body as ICreateRentalPayload);
    const payload = req.body as ICreateRentalPayload;
    const userId = req.user?.id as string;
    const rentalRequest = await rentalService.createRentalRequestDB(
      payload,
      userId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental request created successfully",
      data: rentalRequest,
    });
  },
);
const getTenantRentalRequests = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const rentalRequests =
      await rentalService.getTenantRentalRequestsDB(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: rentalRequests,
    });
  },
);
const getTenantRequestsDetail = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id as string;
    const userId = req.user?.id as string;
    const rentalRequest = await rentalService.getTenantRequestsDetailDB(
      requestId,
      userId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully",
      data: rentalRequest,
    });
  },
);

// Landlord Part //
const getLandlordAllRequests = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const rentalRequests = await rentalService.getLandlordAllRequestsDB(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Requests retrieved successfully",
      data: rentalRequests,
    });
  },
);

const getLandlordRequestsDetail = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id as string;
    const userId = req.user?.id as string;
    const rentalRequest = await rentalService.getLandlordRequestsDetailDB(
      requestId,
      userId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully",
      data: rentalRequest,
    });
  },
);

const updateLandlordRequestStatus = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id as string;
    const userId = req.user?.id as string;
    const payload = req.body as IRentalUpdateStatus;
    const rentalRequest = await rentalService.updateLandlordRequestStatusDB(
      requestId,
      userId,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request status updated successfully",
      data: rentalRequest,
    });
  },
);

export const rentalController = {
  createRentalRequest,
  getTenantRentalRequests,
  getTenantRequestsDetail,
  getLandlordAllRequests,
  getLandlordRequestsDetail,
  updateLandlordRequestStatus,
};
