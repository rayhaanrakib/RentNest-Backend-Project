import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums";
import { tryCatchAsync } from "../utils/tryCatchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: UserRole;
      };
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) => {
  return tryCatchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized",
          "No authentication token provided",
        );
      }
      const verifiedResult = jwtUtils.verifyToken(
        token,
        config.jwtAccessSecret,
      );
      if (!verifiedResult.success) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized",
          verifiedResult.error,
        );
      }
      const { email, name, id, role } = verifiedResult.data as JwtPayload;
      req.user = { email, name, id, role };

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Forbidden",
          "You don't have permission to access this resource.",
        );
      }
      const user = await prisma.user.findUnique({
        where: {
          id,
          name,
          email,
          role,
        },
      });
      if (!user) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized",
          "Session expired, Please log in again",
        );
      }
      if (user.status === "INACTIVE") {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized",
          "User is inactive, Please contact support",
        );
      }

      req.user = {
        email,
        name,
        id,
        role,
      };

      next();
    },
  );
};
