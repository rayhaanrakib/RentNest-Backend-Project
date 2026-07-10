import { Response } from "express";


type TErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorDetails?: unknown;
};
export const sendErrorResponse = (res: Response, data: TErrorResponse) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    errorDetails: data.errorDetails,
  });
};