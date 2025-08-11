import mongoose from "mongoose";
import {
  AvailablePostApprovalStatuses,
  AvailablePostStatuses,
  PostApprovalType,
  PostStatusType,
} from "../utils/Constants";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: AvailablePostStatuses,
      default: PostStatusType.DRAFT,
    },
    approvalStatus: {
      type: String,
      enum: AvailablePostApprovalStatuses,
      default: PostApprovalType.PENDING,
    },
    approvalComment: {
      type: String,
      default: "",
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
