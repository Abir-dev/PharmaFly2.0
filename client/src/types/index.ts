export interface Product {
  _id?: string;
  id?: string;
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
  created_at: string;
  updated_at: string;
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  user_id: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  _id?: string;
  id?: string;
  order_number: string;
  user_id: string;
  user?: User;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_type: 'normal' | 'drone';
  delivery_time_min: number;
  estimated_delivery: string;
  actual_delivery?: string;
  tracking_number?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  payment_method: 'cod' | 'card' | 'upi' | 'netbanking';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string | { _id: string; name: string; images: string[] };
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  prescription_required: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface SearchFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  prescription_required?: boolean;
  in_stock?: boolean;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface PaymentMethod {
  id: string;
  type: 'cod' | 'card' | 'upi';
  name: string;
  description: string;
  is_active: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
} 