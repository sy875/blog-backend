import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { getPostReviews } from "../controllers/postReview.controller";

const router = Router();

router.route("/").get(verifyJWT, getPostReviews);

export default router;
