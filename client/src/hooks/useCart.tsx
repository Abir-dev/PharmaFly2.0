import React, { useState, useEffect, createContext, useContext } from 'react';
import type { CartItem, Product } from '../types';
import { useAuth } from './useAuth';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<{ error: string | null }>;
  removeFromCart: (cartItemId: string) => Promise<{ error: string | null }>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<{ error: string | null }>;
  clearCart: () => Promise<{ error: string | null }>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Product, quantity: number) => {
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.product_id === (product._id || product.id));

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        setCartItems(prev =>
          prev.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        // Add new item
        const newCartItem: CartItem = {
          id: Date.now().toString(), // Simple ID generation
          user_id: user?.id || 'anonymous',
          product_id: product._id || product.id,
          quantity,
          product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCartItems(prev => [...prev, newCartItem]);
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    try {
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity }
            : item
        )
      );

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 