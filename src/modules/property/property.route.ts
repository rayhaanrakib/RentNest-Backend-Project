import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { propertyController } from "./property.controller";

const router = Router()

router.get("/", propertyController.getPropertyList);
router.get("/my-property",auth(UserRole.LANDLORD), propertyController.getMyPropertyList);
router.get("/:id", propertyController.getPropertyDetail);

router.post("/landlord/create",auth(UserRole.LANDLORD), propertyController.createProperty);
router.patch("/:id/status",auth(UserRole.LANDLORD), propertyController.updatePropertyStatus);
router.put("/landlord/:id",auth(UserRole.LANDLORD), propertyController.updateProperty);
router.delete("/landlord/:id",auth(UserRole.LANDLORD), propertyController.deleteProperty);

export const propertyRouter = router;
