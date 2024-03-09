import mongoose, { Schema } from "mongoose";

const variationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    whoCreate: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Variation = mongoose.model("Variation", variationSchema);
