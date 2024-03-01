import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    details: {
      type: String,
      require: true,
    },
    categoryImage: {
      type: String,
      require: true,
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
