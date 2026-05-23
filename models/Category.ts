import mongoose, { Schema, models } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
}, { timestamps: true });

export default models.Category || mongoose.model('Category', CategorySchema);
