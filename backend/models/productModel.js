import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    shopId: { type: Number, required: true },
    shopName: { type: String, required: true },

    title: { type: String, required: true },
    vgcVariantId: { type: String, required: true },
    ryeVariantId: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
