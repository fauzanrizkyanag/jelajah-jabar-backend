import express from "express";
import {
  fetchReviewsByDestination,
  addReview,
  modifyReview,
  removeReview,
} from "../controllers/reviewController.js";

import { validate } from "../middlewares/validation.js";

import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/reviewValidator.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/destination/:destinationId", fetchReviewsByDestination);

router.post("/", authenticate, validate(createReviewSchema), addReview);

router.put("/:id", authenticate, validate(updateReviewSchema), modifyReview);

router.delete("/:id", authenticate, removeReview);

export default router;
