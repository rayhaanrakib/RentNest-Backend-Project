import { ICreateRentalPayload, IRentalUpdateStatus } from "./rental.interface";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import httpStatus from "http-status-codes";
import {
  ALL_RENTAL_REQUESTS,
  CREATE_REQUEST,
  LANDLORD_ALL_RENTAL_REQUESTS,
  LANDLORD_RENTAL_REQUESTS_DETAIL,
  RENTAL_REQUEST_DETAIL,
} from "./rental.utils";
import { PropertyStatus, RentalStatus } from "../../../generated/prisma/enums";
import { validateUpdateRentalStatus } from "./rental.validation";

const createRentalRequestDB = async (
  payload: ICreateRentalPayload,
  userId: string,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
    select: {
      id: true,
      title: true,
      address: true,
      rentAmount: true,
      status: true,
      landlordId: true,
    },
  });
  if (!property) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Property does not exist",
    );
  }
  //   property status check
  if (property.status !== PropertyStatus.AVAILABLE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "This property is not available for rent",
    );
  }
  // cannot request own property
  if (property.landlordId === userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "You cannot rent your own property",
    );
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId: userId,
      propertyId: payload.propertyId,
      status: RentalStatus.PENDING,
    },
  });
  if (existingRequest) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Conflict",
      "You already have a pending rental request for this property",
    );
  }

  const request = await prisma.rentalRequest.create({
    data: {
      tenantId: userId,
      propertyId: payload.propertyId,
      moveInDate: new Date(payload.moveInDate),
      duration: payload.duration,
      message: payload.message,
    },
    select: CREATE_REQUEST,
  });
  return request;
};

const getTenantRentalRequestsDB = async (userId: string) => {
  const total_requests = await prisma.rentalRequest.count({
    where: {
      tenantId: userId,
    },
  });
  const total_pending_requests = await prisma.rentalRequest.count({
    where: {
      tenantId: userId,
      status: RentalStatus.PENDING,
    },
  });
  const total_active_requests = await prisma.rentalRequest.count({
    where: {
      tenantId: userId,
      status: RentalStatus.ACTIVE,
    },
  });
  const total_approved_requests = await prisma.rentalRequest.count({
    where: {
      tenantId: userId,
      status: RentalStatus.APPROVED,
    },
  });
  const total_rejected_requests = await prisma.rentalRequest.count({
    where: {
      tenantId: userId,
      status: RentalStatus.REJECTED,
    },
  });

  const requests = await prisma.rentalRequest.findMany({
    where: {
      tenantId: userId,
    },
    select: ALL_RENTAL_REQUESTS,
  });
  return {
    total_requests,
    total_pending_requests,
    total_active_requests,
    total_approved_requests,
    total_rejected_requests,
    requests,
  };
};

const getTenantRequestsDetailDB = async (requestId: string, userId: string) => {
  // check if request exists
  const requestExist = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      tenantId: true,
    },
  });
  if (!requestExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Rental request does not exist",
    );
  }

  if (requestExist.tenantId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "You do not have permission to access this request",
    );
  }
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    select: RENTAL_REQUEST_DETAIL,
  });
  return request;
};

const getLandlordAllRequestsDB = async (userId: string) => {
  const total_requests = await prisma.rentalRequest.count({
    where: {
      property: {
        landlordId: userId,
      },
    },
  });
  const total_pending_requests = await prisma.rentalRequest.count({
    where: {
      property: {
        landlordId: userId,
      },
      status: RentalStatus.PENDING,
    },
  });
  const total_approved_requests = await prisma.rentalRequest.count({
    where: {
      property: {
        landlordId: userId,
      },
      status: RentalStatus.APPROVED,
    },
  });
  const total_rejected_requests = await prisma.rentalRequest.count({
    where: {
      property: {
        landlordId: userId,
      },
      status: RentalStatus.REJECTED,
    },
  });
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId: userId,
      },
    },
    select: LANDLORD_ALL_RENTAL_REQUESTS,
  });
  return {
    total_requests,
    total_pending_requests,
    total_approved_requests,
    total_rejected_requests,
    requests,
  };
};

const getLandlordRequestsDetailDB = async (
  requestId: string,
  userId: string,
) => {
  // check if request exists
  const requestExist = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      property: {
        select: {
          landlordId: true,
        },
      },
    },
  });
  if (!requestExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Rental request does not exist",
    );
  }
  //  check owner of the request
  if (requestExist.property.landlordId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "You do not have permission to access this request",
    );
  }
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    select: LANDLORD_RENTAL_REQUESTS_DETAIL,
  });
  return request;
};

const updateLandlordRequestStatusDB = async (
  requestId: string,
  userId: string,
  payload: IRentalUpdateStatus,
) => {
  validateUpdateRentalStatus(payload);

  const requestExist = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      status: true,
      property: {
        select: {
          landlordId: true,
        },
      },
    },
  });
  if (!requestExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Rental request does not exist",
    );
  }
  //  check owner of the request
  if (requestExist.property.landlordId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "You do not have permission to access this request",
    );
  }
  if (
    requestExist.status === RentalStatus.ACTIVE ||
    requestExist.status === RentalStatus.COMPLETED ||
    requestExist.status === RentalStatus.CANCELLED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "This rental request can no longer be updated",
    );
  }

  if (
    payload.status === RentalStatus.ACTIVE ||
    payload.status === RentalStatus.COMPLETED ||
    payload.status === RentalStatus.CANCELLED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "This status can only be updated through the payment process",
    );
  }

  // Prevent updating to the same status
  if (requestExist.status === payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Rental status is already updated",
    );
  }

  const result = await prisma.rentalRequest.update({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      status: true,
      propertyId: true,
      tenantId: true,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

export const rentalService = {
  // tenant //
  createRentalRequestDB,
  getTenantRentalRequestsDB,
  getTenantRequestsDetailDB,
  // landlord //
  getLandlordAllRequestsDB,
  getLandlordRequestsDetailDB,
  updateLandlordRequestStatusDB,
};
