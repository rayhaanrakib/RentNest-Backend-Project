import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router()

router.get("/users/all", auth(UserRole.ADMIN), adminController.getAllUsers);
router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsersByFilter);
router.get("/users/:id", auth(UserRole.ADMIN), adminController.getSpecificUserDetail);
router.patch("/users/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);

router.get("/profile", auth(UserRole.ADMIN), adminController.getProfile);
router.get("/stats", auth(UserRole.ADMIN), adminController.getStats);
export const adminRouter = router;