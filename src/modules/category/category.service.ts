import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateCategoryPayload } from "./category.interface";
import httpStatus from "http-status";

const getAllCategoriesDB = async () => {
  const category = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          properties: true,
        },
      },
    },
  });
  return category;
};

const createCategoryDB = async (
  payload: ICreateCategoryPayload,
  userId: string,
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
  const categoryName = payload.name;
  const categoryNameExist = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });
  if (categoryNameExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Conflict",
      "Category name already exists",
    );
  }
  const category = await prisma.category.create({
    data: payload,
  });
  return category;
};

const deleteCategoryDB = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      _count: {
        select: {
          properties: true,
        },
      },
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "NotFound", "Category not found");
  }
  const hasProperty = category._count.properties > 0;
  if (hasProperty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "BadRequest",
      "Category has properties, cannot be deleted. Reassign properties first.",
    );
  }
  const result = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
  return result;
};

const getSpecificCategoryPropertiesDB = async (categoryId: string) => {
  const categoryExist = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      name: true,
    },
  });
  if (!categoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "NotFound", "Category not found");
  }
  const categoryName = categoryExist.name;
  const propertiesCount = await prisma.property.count({
    where: {
      categoryId: categoryId,
    },
  });
  const properties = await prisma.property.findMany({
    where: {
      categoryId: categoryId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
      rentAmount: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      amenities: true,
      images: true,
      status: true,
    },
  });

  return {properties,categoryName,propertiesCount};
};

export const categoryService = {
  getAllCategoriesDB,
  getSpecificCategoryPropertiesDB,
  createCategoryDB,
  deleteCategoryDB,
};
