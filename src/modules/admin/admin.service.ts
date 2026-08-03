import httpStatus from "http-status-codes";
import { Prisma } from "../../../generated/prisma/client";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  IUpdateUserStatusPayload,
  IUserListByFilterQuery
} from "./admin.interface";

const validateUpdateUserStatus = (payload: IUpdateUserStatusPayload) => {
  if (!payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "User status is required. Please select a valid status.",
    );
  }
};

const getAllUsersByFilterDB = async (query: IUserListByFilterQuery) => {
  if (query.role === UserRole.ADMIN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Admin cannot be retrieved.",
    );
  }

  const where: Prisma.UserWhereInput = {
    role: {
      not: UserRole.ADMIN,
    },
  };

  // Role filter
  if (query.role) {
    where.role = query.role;
  }

  // Status filter
  if (query.status) {
    where.status = query.status;
  }

  const total = await prisma.user.count({
    where,
  });

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          properties: true,
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  return {
    meta: {
      total,
    },
    users,
  };
};

const getAllUsersDB = async () => {
  const total_users = await prisma.user.count({
    where: {
      role: {
        not: UserRole.ADMIN,
      },
    },
  });
  const total_landlords = await prisma.user.count({
    where: {
      role: UserRole.LANDLORD,
    },
  });
  const total_tenants = await prisma.user.count({
    where: {
      role: UserRole.TENANT,
    },
  });
  const active_users = await prisma.user.count({
    where: {
      status: UserStatus.ACTIVE,
      role: {
        not: UserRole.ADMIN,
      },
    },
  });
  const inactive_users = await prisma.user.count({
    where: {
      status: UserStatus.INACTIVE,
    },
  });
  const result = await prisma.user.findMany({
    where: {
      role: {
        not: UserRole.ADMIN,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          properties: true,
          rentals: true,
          reviews: true,
        },
      },
    },
  });
  return {
    meta: {
      total_users,
      total_landlords,
      total_tenants,
      active_users,
      inactive_users,
    },
    users: result,
  };
};
const updateUserStatusDB = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  validateUpdateUserStatus(payload);
  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "User does not exist",
    );
  }
  if (userExist.role === UserRole.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Forbidden",
      "Cannot modify admin account status",
    );
  }
  if (userExist.status === payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "User status is already updated",
    );
  }
  const { name, email } = userExist;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      status: true,
      updatedAt: true,
    },
    data: {
      status: payload.status,
    },
  });
  return user;
};

const getStatsDB = async () => {
  const [
    totalUsers,
    totalTenants,
    totalLandlords,
    totalProperties,
    totalRentals,
    totalRevenueResult,
    pendingRequests,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
    prisma.user.count({ where: { role: "TENANT" } }),
    prisma.user.count({ where: { role: "LANDLORD" } }),
    prisma.property.count(),
    prisma.rentalRequest.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    }),
    prisma.rentalRequest.count({ where: { status: "PENDING" } }),
  ]);

  const totalRevenue = totalRevenueResult._sum.amount || 0;

  return {
    totalUsers,
    totalTenants,
    totalLandlords,
    totalProperties,
    totalRentals,
    totalRevenue,
    pendingRequests,
  };
};

const getProfileDB = async (userId: string) => {
  const admin = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return admin;
};

export const adminService = {
  getProfileDB,
  getStatsDB,
  getAllUsersDB,
  getAllUsersByFilterDB,
  updateUserStatusDB,
};
