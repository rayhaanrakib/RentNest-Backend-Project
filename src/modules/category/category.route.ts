import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router();

router.get("/", categoryController.getAllCategories)
router.post("/", auth(UserRole.ADMIN,), categoryController.createCategory)
router.delete("/:id", auth(UserRole.ADMIN,), categoryController.deleteCategory)
router.get("/:id", categoryController.getSpecificCategoryProperties)

export const categoryRouter = router;