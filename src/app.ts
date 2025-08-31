import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";

const app = express();

dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return requestIp.getClientIp(req) || "unknown";
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import postReviewsRoutes from "./routes/postReview.routes.js";
import { ApiError } from "./utils/api-error.js";
import { verifyApiKey } from "./middleware/auth.middleware.js";

app.use("/api/v1/auth", authRoutes);
app.use(verifyApiKey);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/review", postReviewsRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export default app;
