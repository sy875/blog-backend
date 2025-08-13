import { Request, Response } from "express";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Post } from "../models/post.models.js";
import { PostApprovalType, PostStatusType } from "../utils/Constants.js";
import { ApiError } from "../utils/api-error.js";
import { PostReview } from "../models/postReview.models.js";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, body, status } = req.body;
  const post = await Post.create({ title, description, body, status });
  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.find({
    status: PostStatusType.PUBLISHED,
    approvalStatus: PostApprovalType.APPROVED,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findOne({
    _id: postId,
    approvalStatus: PostApprovalType.APPROVED,
  });
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, body, status } = req.body;
  const post = await Post.findOneAndUpdate(
    {
      _id: id,
      approvalStatus: { $ne: PostApprovalType.APPROVED },
      author: req.user._id,
    },
    {
      $set: { title, description, body, status },
    },
    { new: true }
  );
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedPost: post }, "Post updated successfully")
    );
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, body, status } = req.body;
  const post = await Post.findOneAndDelete({
    _id: id,
    approvalStatus: { $ne: PostApprovalType.APPROVED },
    author: req.user._id,
  });
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedPost: post }, "Post deleted successfully")
    );
});

//Admin routes

export const getAllPendingPost = asyncHandler(
  async (req: Request, res: Response) => {
    const post = await Post.find({
      status: PostStatusType.PUBLISHED,
      approvalStatus: PostApprovalType.PENDING,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { allPendingPost: post },
          "All pending post fetched successfully"
        )
      );
  }
);

export const updatePostApproval = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, approvalComment } = req.body;

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: { approvalStatus: status, approvalComment },
      },
      { new: true }
    );

    await PostReview.create({
      post: post?._id,
      admin: req.user._id,
      action: status,
      comment: approvalComment || "",
    });

    if (!post) {
      throw new ApiError(404, "Post does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          post,
          `Post has been ${status.toLowerCase()} successfully`
        )
      );
  }
);
