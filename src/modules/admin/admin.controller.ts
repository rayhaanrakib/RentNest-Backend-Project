import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.service";

const getAllUsers = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await adminService.getAllUsersDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: users,
    });
  },
);

export const adminController = {
//   getDashboardStats,
  getAllUsers,
};