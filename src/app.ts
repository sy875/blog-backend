import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());
// required for passport
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

import { errorHandler } from "./middleware/error.middleware.js";
console.log(process.env.GOOGLE_CLIENT_ID,"before import")
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import postReviewsRoutes from "./routes/postReview.routes.js";
import passport from "passport";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/review", postReviewsRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export default app;
