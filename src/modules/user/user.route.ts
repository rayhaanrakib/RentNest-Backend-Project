import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router()

router.get("/me", auth(UserRole.TENANT, UserRole.LANDLORD), userController.getUserInfo);


export const userRouter = router;