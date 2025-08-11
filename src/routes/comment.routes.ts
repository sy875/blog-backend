import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComment,
  updateComment,
} from "../controllers/comment.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { mongodIdPathVariableValidator } from "../validators/common/mongodb.validators";

const router = Router();

router.route("/").get(getAllComment).post(verifyJWT, createComment);

router
  .route("/:commentId")
  .all(mongodIdPathVariableValidator("commentId"), verifyJWT)
  .patch(updateComment)
  .delete(deleteComment);

export default router;
