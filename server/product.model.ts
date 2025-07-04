import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  composition?: string;
  dosage?: string;
  manufacturer?: string;
  prescription_required: boolean;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  subcategory: { type: String },
  images: { type: [String], default: [] },
  composition: { type: String },
  dosage: { type: String },
  manufacturer: { type: String },
  prescription_required: { type: Boolean, required: true },
  stock_quantity: { type: Number, required: true },
  is_featured: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 