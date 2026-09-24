import express from "express";
import {
  fetchCategories,
  addCategory,
  modifyCategory,
  removeCategory,
} from "../controllers/categoryController.js";

import { validate } from "../middlewares/validation.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categoryValidator.js";

import { authenticate } from "../middlewares/auth.js";

import { requireRole } from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", fetchCategories);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(createCategorySchema),
  addCategory,
);

router.put(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(updateCategorySchema),
  modifyCategory,
);

router.delete("/:id", authenticate, requireRole("ADMIN"), removeCategory);

export default router;
