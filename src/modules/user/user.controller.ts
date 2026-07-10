import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { userService } from "./user.service";
import AppError from "../../utils/AppError";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getUserInfo = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const verifiedResult = jwtUtils.verifyToken(
      accessToken,
      config.jwtAccessSecret,
    );
    if (!verifiedResult.success) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized",
        verifiedResult.error,
      );
    }
    const verifiedToken = verifiedResult.data as JwtPayload;
    const profile = await userService.getUserInfoDB(verifiedToken.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: profile,
    });
  },
);

export const userController = {
  getUserInfo,
};
