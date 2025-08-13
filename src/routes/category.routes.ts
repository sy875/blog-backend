import { Router } from "express";
import { verifyJWT, verifyPermission } from "../middleware/auth.middleware.js";
import { UserRolesEnum } from "../utils/Constants.js";
import {
  createCategory,
  getAllCategory,
} from "../controllers/category.controllers.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]), createCategory)
  .get(getAllCategory);

export default router;
