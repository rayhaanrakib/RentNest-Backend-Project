import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateReviewPayload } from "./review.interface";
import httpStatus from "http-status-codes";

const validateCreateReview = (payload: ICreateReviewPayload) => {
  if (!payload.propertyId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Property ID is required"
    );
  }
  if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Rating must be between 1 and 5"
    );
  }
  if (!payload.comment?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Comment is required"
    );
  }
};

const createReviewDB = async (data: ICreateReviewPayload, tenantId: string) => {
  validateCreateReview(data);

  // Check property exists
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    select: { id: true, title: true },
  });

  if (!property) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Property not found"
    );
  }

  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: data.propertyId,
      status: { in: ["COMPLETED", "ACTIVE"] },
    },
  });

  if (!completedRental) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Forbidden",
      "You can only review properties you have rented. Complete your rental first."
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId: data.propertyId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Conflict",
      "You have already reviewed this property"
    );
  }

  // Create the review
  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId: data.propertyId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      tenant: { select: { id: true, name: true, avatar: true } },
      property: { select: { id: true, title: true } },
    },
  });

  return review;
};

export const reviewService = {
  createReviewDB
}