import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    await updateQuantity(cartItemId, newQuantity);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  const handleRemoveItem = async (cartItemId: string) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(cartItemId);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0; // Free shipping over ₹500
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-[#00B4D8] mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#48CAE4] mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-400 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="pharma" size="lg">
                  Start Shopping
                </Button>
              </Link>
              <Link to="/">
                <Button variant="pharmaOutline" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/products">
              <Button variant="ghost" size="sm" className="text-[#00B4D8] hover:text-[#48CAE4]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-[#48CAE4]">Shopping Cart</h1>
            <Badge variant="pharma" className="text-sm">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }}
            className="text-red-400 hover:text-red-300"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-gray-900 border-[#00B4D8]">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0] || '/first-aid.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#CAF0F8] mb-1 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {item.product.category}
                          </p>
                          <div className="flex items-center space-x-2 mb-3">
                            {item.product.prescription_required && (
                              <Badge variant="prescription" className="text-xs">
                                Prescription Required
                              </Badge>
                            )}
                            {item.product.stock_quantity === 0 && (
                              <Badge variant="outOfStock" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-[#00B4D8] rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={updatingItems.has(item.id) || item.quantity <= 1}
                              className="px-3 py-1 hover:bg-[#00B4D8] hover:text-[#03045E] transition-colors disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1 min-w-[40px] text-center">
                              {updatingItems.has(item.id) ? (
                                <div className="w-4 h-4 border border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto"></div>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={updatingItems.has(item.id) || item.quantity >= item.product.stock_quantity}
                              className="px-3 py-1 hover:bg-[#00B4D8] hover:text-[#03045E] transition-colors disabled:opacity-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm text-gray-400">
                            Stock: {item.product.stock_quantity}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#48CAE4]">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatPrice(item.product.price)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-[#00B4D8] sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#48CAE4] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-[#CAF0F8]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-[#CAF0F8]">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-sm text-[#00B4D8] bg-[#00B4D8]/10 p-2 rounded">
                      Add ₹{500 - subtotal} more for free shipping
                    </div>
                  )}
                  <div className="border-t border-[#00B4D8] pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-[#48CAE4]">Total</span>
                      <span className="text-lg font-semibold text-[#48CAE4]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="pharma"
                  size="lg"
                  className="w-full mb-4"
                  onClick={handleCheckout}
                  disabled={cartItems.some(item => item.product.stock_quantity === 0)}
                >
                  Proceed to Checkout
                </Button>

                {cartItems.some(item => item.product.stock_quantity === 0) && (
                  <p className="text-sm text-red-400 text-center">
                    Some items are out of stock. Please remove them to continue.
                  </p>
                )}

                <div className="text-sm text-gray-400 text-center">
                  <p>Secure checkout powered by Stripe</p>
                  <p className="mt-2">Free returns within 30 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#48CAE4] mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with recommended products based on cart items */}
            <div className="bg-gray-900 rounded-lg border border-[#00B4D8] p-4 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg mx-auto mb-4"></div>
              <p className="text-sm text-gray-400">Loading recommendations...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 