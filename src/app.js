import express from "express";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";

import destinationRoutes from "./routes/destinationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { authenticate } from "./middlewares/auth.js";

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "1mb",
  }),
);
app.use(helmet());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Jelajah Jabar API is running",
  });
});

app.get("/api/me", authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

app.use("/api/destinations", destinationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

export default app;
