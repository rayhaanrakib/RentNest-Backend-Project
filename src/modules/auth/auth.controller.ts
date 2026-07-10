import { NextFunction, Request, Response } from "express";
import { tryCatchAsync } from "../../utils/tryCatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";

const registerUser = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await authService.registerUserDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Account created successfully",
      data: { user },
    });
  },
);

const loginUser = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { user, accessToken, refreshToken } =
      await authService.loginUserDB(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, //24h
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7d
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: {
        user,
        accessToken,
      },
    });
  },
);

const refreshToken = tryCatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, //24h
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Refresh successful",
      data: { accessToken },
    });
  },
);



export const authController = {
  registerUser,
  loginUser,
  refreshToken,
};
