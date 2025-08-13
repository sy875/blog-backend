import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import ApiResponse from "../utils/api-response";
import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";
import { Comment } from "../models/comment.models";

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post does not exist");
    }

    const commentExist = await Comment.find({
      post: postId,
      user: req.user._id,
    });
    if (commentExist) {
      throw new ApiError(409, "Comment exist");
    }

    const newComment = await Comment.create({
      post: postId,
      user: req.user._id,
      comment,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comment: newComment },
          "Comment created successfully"
        )
      );
  }
);

export const getAllComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const allComment = await Comment.find({ post: postId });

    return res
      .status(200)
      .json(new ApiResponse(200, allComment, "Comments fetched successfully"));
  }
);

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { comment } = req.body;

    const updateComment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        user: req.user._id,
      },
      {
        $set: { comment },
      },
      { new: true }
    );

    if (!updateComment) {
      throw new ApiError(404, "Comment does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updateComment, "Comment updated successfully")
      );
  }
);
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;

    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      user: req.user._id,
    });

    if (!deletedComment) {
      throw new ApiError(404, "Comment does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedComment, "Comment updated successfully")
      );
  }
);
