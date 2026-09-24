import express from "express";

import {
  fetchFavorites,
  addToFavorite,
  deleteFromFavorite,
} from "../controllers/favoriteController.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, fetchFavorites);

router.post("/", authenticate, addToFavorite);

router.delete("/:destinationId", authenticate, deleteFromFavorite);

export default router;
