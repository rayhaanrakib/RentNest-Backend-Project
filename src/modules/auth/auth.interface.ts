import { UserRole } from "../../../generated/prisma/enums";

export interface ILoginUser {
   email: string;
   password: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}