import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true },
    price: { type: Number, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    checked: { type: Boolean, default: false },
    inStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.product || mongoose.model('product', productSchema);

export default Product;
