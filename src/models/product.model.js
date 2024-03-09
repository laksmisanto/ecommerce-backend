import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productThumbnail: {
      type: [String],
      required: true,
    },
    productDetails: {
      type: String,
      required: true,
    },
    productCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    inventory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Inventory",
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
    whoCreate: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
