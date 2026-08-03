import httpStatus from "http-status";
import {
  ICreatePropertyPayload,
  IUpdatePropertyPayload,
  IUpdatePropertyStatusPayload,
} from "./property.interface";
import AppError from "../../utils/AppError";
import { PropertyStatus } from "../../../generated/prisma/enums";

export const validateCreateProperty = (
  payload: ICreatePropertyPayload,
): void => {
  const {
    title,
    description,
    address,
    city,
    state,
    zipCode,
    rentAmount,
    area,
    landlordId,
    categoryId,
  } = payload;

  if (!title?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Title is required",
    );
  }

  if (!description?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Description is required",
    );
  }

  if (!address?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Address is required",
    );
  }

  if (!city?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "City is required",
    );
  }

  if (!state?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "State is required",
    );
  }

  if (!zipCode?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Zip code is required",
    );
  }

  if (rentAmount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Rent amount must be greater than 0",
    );
  }


  if (area <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Area must be greater than 0",
    );
  }

  if (!landlordId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Landlord ID is required",
    );
  }

  if (!categoryId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Category ID is required",
    );
  }
};

export const validateUpdateProperty = (
  payload: IUpdatePropertyPayload,
): void => {
  if (payload.rentAmount !== undefined && payload.rentAmount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Rent amount must be greater than 0",
    );
  }

  if (
    payload.status &&
    !Object.values(PropertyStatus).includes(payload.status)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Invalid property status",
    );
  }
};
