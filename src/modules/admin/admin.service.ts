import { Prisma } from "../../../generated/prisma/client";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  IUpdateUserStatusPayload,
  IUserListByRoleQuery,
} from "./admin.interface";
import httpStatus from "http-status-codes";

const validateUpdateUserStatus = (payload: IUpdateUserStatusPayload) => {
  if (!payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "User status is required. Please select a valid status.",
    );
  }
};

const getAllUsersByRoleDB = async (query: IUserListByRoleQuery) => {
  const where: Prisma.UserWhereInput = {
    role: {
      not: UserRole.ADMIN,
    },
  };
  if (query.role === UserRole.ADMIN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Admin cannot be retrieved.",
    );
  }
  let total = 0;
  if (query.role === UserRole.LANDLORD) {
    where.role = UserRole.LANDLORD;

    total = await prisma.user.count({
      where: {
        role: UserRole.LANDLORD,
      },
    });
  } else if (query.role === UserRole.TENANT) {
    where.role = UserRole.TENANT;

    total = await prisma.user.count({
      where: {
        role: UserRole.TENANT,
      },
    });
  }
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

export const adminService = {
  // getProfileDB,
  // getStatsDB,
  getAllUsersDB,
  getAllUsersByRoleDB,
  updateUserStatusDB,
};
