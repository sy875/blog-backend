import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getPostReviews } from "../controllers/postReview.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getPostReviews);

export default router;
