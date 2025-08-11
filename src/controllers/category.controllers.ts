import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import ApiResponse from "../utils/api-response";
import { Category } from "../models/categories.models";
import { ApiError } from "../utils/api-error";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const duplicateName = name.trim().toLowerCase();
    const categoryExist = await Category.find({ name: duplicateName });
    if (categoryExist) {
      throw new ApiError(409, "Category exist");
    }
    const category = await Category.create({ name, createdBy: req.user._id });
    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  }
);
export const getAllCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const allCategory = await Category.find({});
    return res
      .status(200)
      .json(
        new ApiResponse(200, allCategory, "Categories fetched successfully")
      );
  }
);
