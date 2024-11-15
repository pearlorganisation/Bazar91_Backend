import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [5, "Min Length For Brand Title is 5"],
      required: [true, "Title Is Required Field !!"],
    },
  },
  {
    timestamps: true,
  }
);

export const BrandModel = new mongoose.model("Brand", brandSchema);
