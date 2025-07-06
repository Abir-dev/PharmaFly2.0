import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  prescription_required: boolean;
}

export interface IAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_type: 'normal' | 'drone';
  delivery_time_min: number;
  estimated_delivery: Date;
  actual_delivery?: Date;
  tracking_number?: string;
  items: IOrderItem[];
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total_amount: number;
  shipping_address: IAddress;
  billing_address: IAddress;
  payment_method: 'cod' | 'card' | 'upi' | 'netbanking';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  total_price: {
    type: Number,
    required: true,
  },
  prescription_required: {
    type: Boolean,
    default: false,
  },
});

const addressSchema = new Schema<IAddress>({
  full_name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address_line1: {
    type: String,
    required: true,
  },
  address_line2: String,
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: 'India',
  },
});

const orderSchema = new Schema<IOrder>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order_number: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  delivery_type: {
    type: String,
    enum: ['normal', 'drone'],
    default: 'normal',
  },
  delivery_time_min: {
    type: Number,
    default: 90, // 90 minutes for normal delivery
  },
  estimated_delivery: {
    type: Date,
    required: true,
  },
  actual_delivery: Date,
  tracking_number: String,
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  shipping_fee: {
    type: Number,
    default: 50,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  shipping_address: {
    type: addressSchema,
    required: true,
  },
  billing_address: {
    type: addressSchema,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ['cod', 'card', 'upi', 'netbanking'],
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  payment_id: String,
  notes: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.order_number = `PF${year}${month}${day}${random}`;
    
    // Set estimated delivery time
    const deliveryTime = this.delivery_type === 'drone' ? 45 : 90; // minutes
    this.estimated_delivery = new Date(Date.now() + deliveryTime * 60 * 1000);
  }
  
  this.updated_at = new Date();
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 