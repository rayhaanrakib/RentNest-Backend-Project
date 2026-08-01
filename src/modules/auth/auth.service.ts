import bcrypt from "bcrypt";
import { UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IJwtPayload, ILoginUser, IRegisterUser } from "./auth.interface";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { User } from "../../../generated/prisma/client";

const createJwtPayload = (authUser: User): IJwtPayload => ({
  id: authUser.id,
  email: authUser.email,
  role: authUser.role,
});
const generateAuthTokens = (jwtPayload: IJwtPayload) => {
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtRefreshSecret,
    config.jwtRefreshExpiresIn as SignOptions,
  );

  return {
    user: jwtPayload,
    accessToken,
    refreshToken,
  };
};

const createAuthSession = (authUser: User) => {
  return generateAuthTokens(createJwtPayload(authUser));
};

const registerUserDB = async (payload: IRegisterUser) => {
  const { name, email, password, role, phone, avatar } = payload;

  // Name
  if (!name || !name.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Name is required",
    );
  }

  // Email
  if (!email || !email.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Email is required",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Invalid email format",
    );
  }

  // Password
  if (!password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Password is required",
    );
  }

  if (password.length < 6) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Password must be at least 6 characters",
    );
  }

  // Role
  if (!role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Role is required",
    );
  }

  if (role !== UserRole.TENANT && role !== UserRole.LANDLORD) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      "Role must be either TENANT or LANDLORD",
    );
  }

  // Phone
  if (phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(phone)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Validation failed",
        "Invalid phone number format",
      );
    }
  }

  // Existing user
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Conflict",
      "An account with this email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcryptSaltRounds),
  );

  const authUser = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      phone,
      avatar,
    },
  });
  const { accessToken, refreshToken, user } = createAuthSession(authUser);
  return {
    user,
    accessToken,
    refreshToken,
  };
};

const loginUserDB = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const authUser = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });
  if (!authUser) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized",
      "Email is not registered",
    );
  }
  const isPasswordCorrect = await bcrypt.compare(password, authUser.password);
  if (!isPasswordCorrect) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized",
      "Password is incorrect, Please try again",
    );
  }
  const { accessToken, refreshToken, user } = createAuthSession(authUser);
  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwtRefreshSecret,
  );
  if (!verifiedRefreshToken.success) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized",
      "Refresh token is invalid",
    );
  }
  const { id } = verifiedRefreshToken.data as JwtPayload;
  const authUser = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (authUser.status === "INACTIVE") {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized",
      "User is inactive!",
    );
  }

  const { accessToken } = createAuthSession(authUser);

  return { accessToken };
};

export const authService = {
  registerUserDB,
  loginUserDB,
  refreshToken,
};
