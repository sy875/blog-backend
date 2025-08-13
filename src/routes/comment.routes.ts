import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComment,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { mongodIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

const router = Router();

router.route("/:postId").get(getAllComment).post(verifyJWT, createComment);

router
  .route("/:commentId")
  .all(mongodIdPathVariableValidator("commentId"), verifyJWT)
  .patch(updateComment)
  .delete(deleteComment);

export default router;
