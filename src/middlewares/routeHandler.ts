import { Request, Response } from "express"
import httpStatus from "http-status"
import { sendErrorResponse } from "../utils/sendErrorResponse"

export const RouteHandler = (req: Request, res: Response) => {
    sendErrorResponse(res, {
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: "Route not found",
        errorDetails: `There is no route with this path ${req.path}`,
    })
}