import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { sendErrorResponse } from "../utils/sendErrorResponse";
import AppError from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "An unexpected error occurred. Please try again later.";
  let errorDetails: unknown =
    process.env.NODE_ENV === "development" ? err.stack : undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.errorType;
    errorDetails = err.message;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message =
      "The request contains invalid or missing required fields. Please verify your input and try again.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message =
          "A record with the provided value already exists. Please use a different value.";
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message =
          "The requested operation could not be completed because a related record does not exist or is still referenced.";
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = "The requested record could not be found.";
        break;

      default:
        statusCode = httpStatus.BAD_REQUEST;
        message = "The database request could not be completed.";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    switch (err.errorCode) {
      case "P1000":
        statusCode = httpStatus.UNAUTHORIZED;
        message =
          "Failed to authenticate with the database server. Please verify the database credentials.";
        break;

      case "P1001":
        statusCode = httpStatus.SERVICE_UNAVAILABLE;
        message =
          "Unable to connect to the database server. Please ensure the database is running and accessible.";
        break;

      default:
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Failed to initialize the database connection.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      "An unexpected database error occurred while processing the request.";
  } else if (err instanceof Error) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;
  }

  sendErrorResponse(res, {
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};
