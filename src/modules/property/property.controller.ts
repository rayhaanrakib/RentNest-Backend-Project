import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { ICreatePropertyPayload, IUpdatePropertyPayload, IUpdatePropertyStatusPayload } from "./property.interface";
import { propertyService } from "./property.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

const createProperty = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as ICreatePropertyPayload;
    const landlordId = req.user?.id as string;
    const property = await propertyService.createPropertyDB(
      payload,
      landlordId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully",
      data: property,
    });
  },
);

const getPropertyList = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const query = req.query;
    const properties = await propertyService.getPropertyListDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: properties,
    });
  },
);
const getAllPropertyList = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const properties = await propertyService.getAllPropertyListDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All properties retrieved successfully",
      data: properties,
    });
  },
);

const getPropertyDetail = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const property = await propertyService.getPropertyDetailDB(propertyId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property detail retrieved successfully",
      data: property,
    });
  },
);
const getMyPropertyList = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const properties = await propertyService.getMyPropertyListDB(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My properties retrieved successfully",
      data: properties,
    });
  },
);
const updatePropertyStatus = tryCatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const propertyId = req.params.id as string;
  const payload = req.body as IUpdatePropertyStatusPayload;
  const property = await propertyService.updatePropertyStatusDB(
    propertyId,
    userId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.ACCEPTED,
    message: "Property status updated successfully",
    data: property,
  });
});
const updateProperty = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const propertyId = req.params.id as string;
    const payload = req.body as IUpdatePropertyPayload;
    const property = await propertyService.updatePropertyDB(
      propertyId,
      userId,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.ACCEPTED,
      message: "Property updated successfully",
      data: property,
    });
  },
);
const deleteProperty = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const propertyId = req.params.id as string;
    await propertyService.deletePropertyDB(
      propertyId,
      userId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully",
      data: null,
    });
  },
);

export const propertyController = {
  getPropertyList,
  getAllPropertyList,
  getPropertyDetail,
  getMyPropertyList,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  deleteProperty,
};
