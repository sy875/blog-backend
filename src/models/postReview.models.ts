import mongoose, { mongo } from "mongoose";
import { AvailablePostApprovalStatuses } from "../utils/Constants";

const postReviewSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      enum: AvailablePostApprovalStatuses,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const PostReview = mongoose.model("PostReview", postReviewSchema);
