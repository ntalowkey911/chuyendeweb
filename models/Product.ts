import mongoose, { Schema, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default models.Product || mongoose.model('Product', ProductSchema);
