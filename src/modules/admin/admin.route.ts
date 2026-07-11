import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router()

router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);
export const adminRouter = router;