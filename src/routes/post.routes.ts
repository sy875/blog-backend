import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  createPost,
  deletePost,
  getPost,
  getPostById,
  updatePost,
} from "../controllers/post.controllers";

const router = Router();

router.route("/").post(verifyJWT, createPost).get(getPost);

router
  .route("/:id")
  .get(getPostById)
  .put(verifyJWT, updatePost)
  .delete(verifyJWT, deletePost);

export default router;
