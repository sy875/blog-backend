import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import { PostReview } from "../models/postReview.models.js";
import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/api-error.js";

export const getPostReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post does not exist");
    }

    if (post.author?.toString() !== req.user._id) {
      throw new ApiError(401, "You are not allowed this operation");
    }

    const postReviews = PostReview.find({ post: post._id });

    return res
      .status(200)
      .json(
        new ApiResponse(200, postReviews, "Post reviews fetched successfully")
      );
  }
);
