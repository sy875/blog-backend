import { Router } from "express";
import { verifyJWT, verifyPermission } from "../middleware/auth.middleware.js";
import { PostApprovalType, UserRolesEnum } from "../utils/Constants.js";
import {
  getAllPendingPost,
  updatePostApproval,
} from "../controllers/post.controllers.js";

const router = Router();

router.use(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]));

router.route("/posts").get(getAllPendingPost);

router.route("/posts/:id/approve").put((req, res, next) => {
  req.body.status = PostApprovalType.APPROVED;
  next();
}, updatePostApproval);

router.route("/posts/:id/reject").put((req, res, next) => {
  req.body.status = PostApprovalType.REJECTED;
  next();
}, updatePostApproval);

export default router;
