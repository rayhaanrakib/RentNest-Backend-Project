import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.service";
import {
  IUpdateUserStatusPayload,
  IUserListByFilterQuery,
} from "./admin.interface";

const getAllUsersByFilter = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as IUserListByFilterQuery;
    const users = await adminService.getAllUsersByFilterDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: users,
    });
  },
);
const getSpecificUserDetail = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await adminService.getSpecificUserDetailDB(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: user,
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
const getStats = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await adminService.getStatsDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Stats retrieved successfully",
      data: stats,
    });
  },
);

const getProfile = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const profile = await adminService.getProfileDB(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: profile,
    });
  },
);

export const adminController = {
  getStats,
  getProfile,
  getAllUsersByFilter,
  getSpecificUserDetail,
  getAllUsers,
  updateUserStatus,
};
