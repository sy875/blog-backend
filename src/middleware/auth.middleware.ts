import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/user.js";
import { User } from "../models/user.models.js";
import { createHash } from "crypto";
import crypto from "crypto";
import { ApiKey } from "../models/apikey.models.js";
/**
 * @description This middleware is responsible for validating access token
 */

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as MyJwtPayload;
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
      );
      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(
        401,
        error instanceof Error ? error.message : "Invalid access token"
      );
    }
  }
);

/**
 *
 * @param {AvailableUserRolez} roles
 * @description  This middleware is responsible for validating multiple user roles at a time
 */
export const verifyPermission = (roles = ["admin"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user._id) {
      throw new ApiError(401, "Unauthorized request");
    }
    if (roles.includes(req.user?.role)) {
      next();
    } else {
      throw new ApiError(403, "You are not allowed to perform this operation");
    }
  });

/**
 * @description This middleware is responsible for validating api key
 */
export const verifyApiKey = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (req.user) {
      return next();
    }

    const incomingApiKey = req.header("x-api-key") || req.query.apiKey;

    if (!incomingApiKey || typeof incomingApiKey != "string") {
      throw new ApiError(401, "Api key is required");
    }

    const hashedApiKey = crypto
      .createHash("sha256")
      .update(incomingApiKey)
      .digest("hex");

    const apiKeyExist = await ApiKey.findOne({ key: hashedApiKey });

    if (!apiKeyExist || !apiKeyExist.isActive) {
      throw new ApiError(401, "Invalid Api key");
    }

    next();
  }
);
