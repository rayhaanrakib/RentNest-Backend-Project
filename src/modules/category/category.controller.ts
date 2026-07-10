import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { categoryService } from "./category.service";
import { ICreateCategoryPayload } from "./category.interface";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllCategories = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await categoryService.getAllCategoriesDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category retrieved successfully",
      data: category,
    });
  },
);
const createCategory = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body as ICreateCategoryPayload;
    const category = await categoryService.createCategoryDB(payload, userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: category,
    });
  },
);

const deleteCategory = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;
    await categoryService.deleteCategoryDB(categoryId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully",
      data: null,
    });
  },
);

const getSpecificCategoryProperties = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;
    const {properties, categoryName, propertiesCount} = await categoryService.getSpecificCategoryPropertiesDB(categoryId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Successfully retrieved ${propertiesCount} properties from the ${categoryName} category`,
      data: properties,
    });
  },
);



export const categoryController = {
  getAllCategories,
  getSpecificCategoryProperties,
  createCategory,
  deleteCategory
};
