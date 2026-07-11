import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();
// Tenant routes
router.post("/", auth(UserRole.TENANT), rentalController.createRentalRequest);
router.get(
  "/:id",
  auth(UserRole.TENANT),
  rentalController.getTenantRequestsDetail,
);
router.get(
  "/",
  auth(UserRole.TENANT),
  rentalController.getTenantRentalRequests,
);

// Landlord Routes
router.get(
  "/landlord/requests/all",
  auth(UserRole.LANDLORD),
  rentalController.getLandlordAllRequests,
);
router.get(
  "/landlord/requests/:id",
  auth(UserRole.LANDLORD),
  rentalController.getLandlordRequestsDetail,
);
router.patch(
  "/landlord/requests/:id",
  auth(UserRole.LANDLORD),
  rentalController.updateLandlordRequestStatus,
);

export const rentalRouter = router;
