import express from "express";
import {
  fetchDestinations,
  fetchDestinationById,
  addDestination,
  modifyDestination,
  removeDestination,
  getAdminDestinations,
} from "../controllers/destinationController.js";

import { validate } from "../middlewares/validation.js";

import {
  createDestinationSchema,
  updateDestinationSchema,
} from "../validators/destinationValidator.js";

import { authenticate } from "../middlewares/auth.js";

import { requireRole } from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", fetchDestinations);

router.get("/admin", authenticate, requireRole("ADMIN"), getAdminDestinations);

router.get("/:id", fetchDestinationById);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(createDestinationSchema),
  addDestination,
);

router.put(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(updateDestinationSchema),
  modifyDestination,
);

router.delete("/:id", authenticate, requireRole("ADMIN"), removeDestination);

export default router;
