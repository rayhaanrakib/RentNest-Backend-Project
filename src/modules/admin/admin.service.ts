import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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
export const adminService = {
  getAllUsersDB,
};
