import { RentalStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalPayload {
  propertyId: string;
  moveInDate: Date | string;
  duration: number;
  message?: string;
}

export interface IUpdateRentalPayload {
  moveInDate?: Date | string;
  duration?: number;
  message?: string;
  status?: RentalStatus;
}

export interface IRentalUpdateStatus {
  status?: RentalStatus;
}

