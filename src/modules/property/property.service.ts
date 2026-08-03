import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  ICreatePropertyPayload,
  IPropertyListQuery,
  IUpdatePropertyPayload,
  IUpdatePropertyStatusPayload,
} from "./property.interface";
import httpStatus from "http-status-codes";
import {
  CREATE_PROPERTY_SELECT,
  ALL_PROPERTY_SELECT,
  SPECIFIC_PROPERTY_SELECT,
  UPDATE_PROPERTY_SELECT,
  BUILD_PROPERTY_CLAUSE,
  BUILD_PROPERTY_ORDER_BY_CLAUSE,
} from "./property.utils";
import {
  validateCreateProperty,
  validateUpdateProperty,
  validateUpdatePropertyStatus,
} from "./property.validation";
import { PropertyStatus } from "../../../generated/prisma/enums";

const createPropertyDB = async (
  payload: ICreatePropertyPayload,
  landlordId: string,
) => {
  validateCreateProperty({
    ...payload,
    landlordId,
  });
  // check the category exists or not
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });
  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Category does not exist",
    );
  }
  // create the property
  const property = await prisma.property.create({
    data: {
      ...payload,
      categoryId: payload.categoryId,
      landlordId,
    },
    select: CREATE_PROPERTY_SELECT,
  });
  return property;
};
const getPropertyListDB = async (query: IPropertyListQuery) => {
  //   console.log("query:", query);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = BUILD_PROPERTY_CLAUSE(query);
  const orderBy = BUILD_PROPERTY_ORDER_BY_CLAUSE(query);
  const total_property = await prisma.property.count({
    where,
  });
  const available_property = await prisma.property.count({
    where: {
      ...where,
      status: PropertyStatus.AVAILABLE,
    },
  });
  const rented_property = await prisma.property.count({
    where: {
      ...where,
      status: PropertyStatus.RENTED,
    },
  });

  const result = await prisma.property.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    select: ALL_PROPERTY_SELECT,
  });
  return {
    meta: {
      page,
      limit,
      totalPage: Math.ceil(total_property / limit),
      total_property,
      available_property,
      rented_property,
    },
    properties: result,
  };
};
const getAllPropertyListDB = async () => {
  return await prisma.property.findMany({
    where: {
      status: PropertyStatus.AVAILABLE,
    },
    select: {
      id: true,
      title: true,
      city: true,
      category: {
        select: {
          id: true
        },
      },
    },
  });
};

const getPropertyDetailDB = async (propertyId: string) => {
  const propertyExist = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });
  if (!propertyExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      `No property found with ID ${propertyId}`,
    );
  }
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    select: SPECIFIC_PROPERTY_SELECT,
  });
  return property;
};

const getMyPropertyListDB = async (userId: string) => {
  const total_property = await prisma.property.count({
    where: {
      landlordId: userId,
    },
  });
  const available_property = await prisma.property.count({
    where: {
      landlordId: userId,
      status: PropertyStatus.AVAILABLE,
    },
  });
  const rented_property = await prisma.property.count({
    where: {
      landlordId: userId,
      status: PropertyStatus.RENTED,
    },
  });
  const unavailable_property = await prisma.property.count({
    where: {
      landlordId: userId,
      status: PropertyStatus.UNAVAILABLE,
    },
  });

  const propertyOwners = await prisma.property.findMany({
    where: {
      landlordId: userId,
    },
  });
  if (propertyOwners.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "No properties found",
    );
  }
  const result = await prisma.property.findMany({
    where: {
      landlordId: userId,
    },
    select: SPECIFIC_PROPERTY_SELECT,
  });
  return {
    meta: {
      total_property,
      available_property,
      rented_property,
      unavailable_property,
    },
    properties: result,
  };
};
const updatePropertyStatusDB = async (propertyId: string, userId: string, payload: IUpdatePropertyStatusPayload) =>{
    validateUpdatePropertyStatus({
      ...payload,
    });
    const propertyExist = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });
    if (!propertyExist) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Bad Request",
        "Property does not exist.",
      );
    }
    if (propertyExist.landlordId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Forbidden",
        "You can only update your own properties",
      );
    }
    const property = await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        status: payload.status,
      },
      select: UPDATE_PROPERTY_SELECT,
    });
    return property;
}
const updatePropertyDB = async (
  propertyId: string,
  userId: string,
  payload: IUpdatePropertyPayload,
) => {
  validateUpdateProperty({
    ...payload,
  });
  const propertyExist = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });
  if (!propertyExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Property does not exist.",
    );
  }
  if (propertyExist.landlordId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Forbidden",
      "You can only update your own properties",
    );
  }
  const property = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      ...payload,
    },
    select: UPDATE_PROPERTY_SELECT,
  });
  return property;
};

const deletePropertyDB = async (propertyId: string, userId: string) => {
  const propertyExist = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });
  if (!propertyExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request",
      "Property does not exist.",
    );
  }
  if (propertyExist.landlordId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Forbidden",
      "You can only delete your own properties",
    );
  }
  const property = await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });
  return property;
};

export const propertyService = {
  getPropertyListDB,
  getAllPropertyListDB,
  getPropertyDetailDB,
  getMyPropertyListDB,
  createPropertyDB,
  updatePropertyDB,
  updatePropertyStatusDB,
  deletePropertyDB,
};
