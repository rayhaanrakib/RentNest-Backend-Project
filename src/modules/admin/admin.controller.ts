import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.service";
import {
  IUpdateUserStatusPayload,
  IUserListByRoleQuery,
} from "./admin.interface";

const getAllUsersByRole = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as IUserListByRoleQuery;
    const users = await adminService.getAllUsersByRoleDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: users,
    });
  },
);

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

const updateUserStatus = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const payload = req.body as IUpdateUserStatusPayload;
    const user = await adminService.updateUserStatusDB(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: user,
    });
  },
);

export const adminController = {
  //   getStats,
  //   getProfile,
  getAllUsersByRole,
  getAllUsers,
  updateUserStatus,
};
