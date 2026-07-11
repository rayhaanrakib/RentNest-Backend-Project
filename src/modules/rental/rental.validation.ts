import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { ICreateRentalPayload } from "./rental.interface";

export const validateCreateRental = (
  payload: ICreateRentalPayload,
): void => {
  const { propertyId, moveInDate, duration, message } = payload;

  if (!propertyId?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Property ID is required",
    );
  }

  if (!moveInDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Move-in date is required",
    );
  }

  const moveIn = new Date(moveInDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(moveIn.getTime())) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Invalid move-in date",
    );
  }

  if (moveIn < today) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Move-in date must be today or in the future",
    );
  }

  if (!duration) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Duration is required",
    );
  }

  if (duration < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Duration must be at least 1 month",
    );
  }

  if (message && message.length > 500) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Message cannot exceed 500 characters",
    );
  }
};

export const validateUpdateRentalStatus = (payload: IRentalUpdateStatus) => {
  if (!payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Rental status is required. Please select a valid status.",
    );
  }
};