import { Router } from "express";
import { verifyJWT, verifyPermission } from "../middleware/auth.middleware";
import { UserRolesEnum } from "../utils/Constants";
import {
  createCategory,
  getAllCategory,
} from "../controllers/category.controllers";

const router = Router();

router
  .route("/")
  .post(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]), createCategory)
  .get(getAllCategory);

export default router;
