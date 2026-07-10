import { prisma } from "../../lib/prisma";

const getUserInfoDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
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
      _count: {
        select: {
          properties: true,
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  return user;
};
export const userService = {
  getUserInfoDB,
};
