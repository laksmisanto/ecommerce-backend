import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    details: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    whoCreated: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
