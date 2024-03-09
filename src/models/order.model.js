import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    whoCreate: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
