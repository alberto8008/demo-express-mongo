import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  productId: { type: Number, required: true },
  variantId: { type: Number, required: true },
  autoClassify: { type: Boolean, required: true },
});

const productSelectionSchema = mongoose.Schema(
  {
    shopId: { type: Number, required: true },
    selection: [productSchema],
  },
  { timestamps: true }
);

const Selection = mongoose.model("ProductSelection", productSelectionSchema);

export default Selection;
