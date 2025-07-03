import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  PRODUCTS: 'products',
  USERS: 'users',
  CART_ITEMS: 'cart_items',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  ADDRESSES: 'addresses',
  CATEGORIES: 'categories',
  PAYMENT_METHODS: 'payment_methods',
} as const; 