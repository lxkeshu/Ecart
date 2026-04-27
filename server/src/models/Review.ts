import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export type Review = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  text: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewDocument = HydratedDocument<Review>;

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model<Review>("Review", ReviewSchema);
