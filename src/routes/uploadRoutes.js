import express from "express";

import { uploadDestinationImage } from "../controllers/uploadController.js";

import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/authorization.js";
import { uploadImage } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/destination-image",
  authenticate,
  requireRole("ADMIN"),
  uploadImage.single("image"),
  uploadDestinationImage,
);

export default router;
