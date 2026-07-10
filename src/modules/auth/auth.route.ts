import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.refreshToken);


export const authRouter = router;