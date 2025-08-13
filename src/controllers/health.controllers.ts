import { Request, Response } from "express";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const healthController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("health controller");
    return res
      .status(200)
      .json(new ApiResponse(200, [], "server is working properly"));
  }
);
