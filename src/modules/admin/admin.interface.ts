import { UserRole, UserStatus } from "../../../generated/prisma/enums";

export interface IUpdateUserStatusPayload {
  status?: UserStatus;
}

export interface IUserListByRoleQuery {
  role?: UserRole;
}
