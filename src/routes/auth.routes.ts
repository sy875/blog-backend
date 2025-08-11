import { Router } from "express";
import passport from "passport";
import {
  changeCurrentPassword,
  forgetPasswordRequest,
  getCurrentUser,
  handleSocialLogin,
  login,
  logout,
  refreshAccessToken,
  resendEmailVerification,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import {
  userAssignRoleValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgottenPasswordValidator,
} from "../validators/auth.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT, verifyPermission } from "../middleware/auth.middleware.js";
import { UserRolesEnum } from "../utils/Constants.js";
import { mongodIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
//import passport config
import "../passport/index.js";
import { createApiKey, getApiKeys } from "../controllers/apikey.controllers.js";
const router = Router();

//basic features of auth
router.route("/register").post(userRegisterValidator(), validate, signup);
router.route("/login").post(userLoginValidator(), validate, login);
router
  .route("/api-key")
  .get(verifyJWT, getApiKeys)
  .post(verifyJWT, createApiKey);
router.route("/me").get(verifyJWT, getCurrentUser);

//Extra fetures

router.route("/logout").get(verifyJWT, logout);
router.route("/refresh-access-token").get(refreshAccessToken);

router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

router.route("/verify-email/:verificationToken").get(verifyJWT, verifyEmail);

router
  .route("/forgot-password")
  .post(
    verifyJWT,
    userForgotPasswordValidator(),
    validate,
    forgetPasswordRequest
  );

router
  .route("/reset-password/:resetToken")
  .post(userResetForgottenPasswordValidator(), validate, resetPassword);

router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword
  );

// SSO routes
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

router.route("/github").get(
  passport.authenticate("github", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to github...");
  }
);

router
  .route("/google/callback")
  .get(passport.authenticate("google"), handleSocialLogin);

router
  .route("/github/callback")
  .get(passport.authenticate("github"), handleSocialLogin);

export default router;
