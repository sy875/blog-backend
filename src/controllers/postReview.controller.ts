import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import ApiResponse from "../utils/api-response";
import { PostReview } from "../models/postReview.models";
import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";

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
