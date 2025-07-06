import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Plane, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils';

interface Address {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface CheckoutForm {
  delivery_type: 'normal' | 'drone';
  shipping_address: Address;
  billing_address: Address;
  payment_method: 'cod' | 'card' | 'upi' | 'netbanking';
  notes: string;
  use_same_address: boolean;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, loading } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const [form, setForm] = useState<CheckoutForm>({
    delivery_type: 'normal',
    shipping_address: {
      full_name: user?.full_name || '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
    },
    billing_address: {
      full_name: user?.full_name || '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
    },
    payment_method: 'cod',
    notes: '',
    use_same_address: true,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cartItems, navigate]);

  const handleAddressChange = (type: 'shipping' | 'billing', field: keyof Address, value: string) => {
    setForm(prev => ({
      ...prev,
      [type === 'shipping' ? 'shipping_address' : 'billing_address']: {
        ...prev[type === 'shipping' ? 'shipping_address' : 'billing_address'],
        [field]: value,
      },
    }));
  };

  const handleUseSameAddress = (checked: boolean) => {
    setForm(prev => ({
      ...prev,
      use_same_address: checked,
      billing_address: checked ? prev.shipping_address : prev.billing_address,
    }));
  };

  const subtotal = getCartTotal();
  const shipping_fee = form.delivery_type === 'drone' ? 100 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping_fee + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('pharmafly_token');
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product_id: item.product._id || item.product.id,
            quantity: item.quantity,
          })),
          delivery_type: form.delivery_type,
          shipping_address: form.shipping_address,
          billing_address: form.use_same_address ? form.shipping_address : form.billing_address,
          payment_method: form.payment_method,
          notes: form.notes,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        
        // If payment method is not COD, redirect to payment page
        if (form.payment_method !== 'cod') {
          navigate('/payment', {
            state: {
              paymentData: {
                orderId: order._id,
                amount: order.total_amount,
                paymentMethod: form.payment_method,
              }
            }
          });
        } else {
          // For COD orders, show success directly
          setOrderId(order._id);
          setOrderSuccess(true);
          await clearCart();
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <Card className="bg-gray-900 border-[#00B4D8] max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#48CAE4] mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-400 mb-4">
              Your order has been confirmed and is being processed.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="font-mono text-[#00B4D8]">{orderId}</p>
            </div>
            <div className="space-y-3">
              <Button
                variant="pharma"
                className="w-full"
                onClick={() => navigate(`/orders/${orderId}`)}
              >
                Track Order
              </Button>
              <Button
                variant="pharmaOutline"
                className="w-full"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cart')}
              className="text-[#00B4D8] hover:text-[#48CAE4]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold text-[#48CAE4]">Checkout</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Type */}
            <Card className="bg-gray-900 border-[#00B4D8]">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Delivery Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative">
                    <input
                      type="radio"
                      name="delivery_type"
                      value="normal"
                      checked={form.delivery_type === 'normal'}
                      onChange={(e) => setForm(prev => ({ ...prev, delivery_type: e.target.value as 'normal' | 'drone' }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.delivery_type === 'normal' 
                        ? 'border-[#00B4D8] bg-[#00B4D8]/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Truck className="h-6 w-6 text-[#00B4D8]" />
                        <div>
                          <h3 className="font-semibold text-[#CAF0F8]">Standard Delivery</h3>
                          <p className="text-sm text-gray-400">90 minutes • ₹50</p>
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative">
                    <input
                      type="radio"
                      name="delivery_type"
                      value="drone"
                      checked={form.delivery_type === 'drone'}
                      onChange={(e) => setForm(prev => ({ ...prev, delivery_type: e.target.value as 'normal' | 'drone' }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.delivery_type === 'drone' 
                        ? 'border-[#00B4D8] bg-[#00B4D8]/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Plane className="h-6 w-6 text-[#00B4D8]" />
                        <div>
                          <h3 className="font-semibold text-[#CAF0F8]">Drone Delivery</h3>
                          <p className="text-sm text-gray-400">45 minutes • ₹100</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-gray-900 border-[#00B4D8]">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_name">Full Name</Label>
                    <Input
                      id="shipping_name"
                      value={form.shipping_address.full_name}
                      onChange={(e) => handleAddressChange('shipping', 'full_name', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_phone">Phone</Label>
                    <Input
                      id="shipping_phone"
                      value={form.shipping_address.phone}
                      onChange={(e) => handleAddressChange('shipping', 'phone', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="shipping_address1">Address Line 1</Label>
                  <Input
                    id="shipping_address1"
                    value={form.shipping_address.address_line1}
                    onChange={(e) => handleAddressChange('shipping', 'address_line1', e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                  />
                </div>
                <div>
                  <Label htmlFor="shipping_address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="shipping_address2"
                    value={form.shipping_address.address_line2}
                    onChange={(e) => handleAddressChange('shipping', 'address_line2', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shipping_city">City</Label>
                    <Input
                      id="shipping_city"
                      value={form.shipping_address.city}
                      onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_state">State</Label>
                    <Input
                      id="shipping_state"
                      value={form.shipping_address.state}
                      onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_postal">Postal Code</Label>
                    <Input
                      id="shipping_postal"
                      value={form.shipping_address.postal_code}
                      onChange={(e) => handleAddressChange('shipping', 'postal_code', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="bg-gray-900 border-[#00B4D8]">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.use_same_address}
                    onChange={(e) => handleUseSameAddress(e.target.checked)}
                    className="text-[#00B4D8] focus:ring-[#00B4D8]"
                  />
                  <span className="text-sm text-gray-300">Same as shipping address</span>
                </label>

                {!form.use_same_address && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing_name">Full Name</Label>
                        <Input
                          id="billing_name"
                          value={form.billing_address.full_name}
                          onChange={(e) => handleAddressChange('billing', 'full_name', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing_phone">Phone</Label>
                        <Input
                          id="billing_phone"
                          value={form.billing_address.phone}
                          onChange={(e) => handleAddressChange('billing', 'phone', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billing_address1">Address Line 1</Label>
                      <Input
                        id="billing_address1"
                        value={form.billing_address.address_line1}
                        onChange={(e) => handleAddressChange('billing', 'address_line1', e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing_address2">Address Line 2 (Optional)</Label>
                      <Input
                        id="billing_address2"
                        value={form.billing_address.address_line2}
                        onChange={(e) => handleAddressChange('billing', 'address_line2', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billing_city">City</Label>
                        <Input
                          id="billing_city"
                          value={form.billing_address.city}
                          onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing_state">State</Label>
                        <Input
                          id="billing_state"
                          value={form.billing_address.state}
                          onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing_postal">Postal Code</Label>
                        <Input
                          id="billing_postal"
                          value={form.billing_address.postal_code}
                          onChange={(e) => handleAddressChange('billing', 'postal_code', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gray-900 border-[#00B4D8]">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={form.payment_method === 'cod'}
                      onChange={(e) => setForm(prev => ({ ...prev, payment_method: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.payment_method === 'cod' 
                        ? 'border-[#00B4D8] bg-[#00B4D8]/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Wallet className="h-6 w-6 text-[#00B4D8]" />
                        <div>
                          <h3 className="font-semibold text-[#CAF0F8]">Cash on Delivery</h3>
                          <p className="text-sm text-gray-400">Pay when you receive</p>
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={form.payment_method === 'card'}
                      onChange={(e) => setForm(prev => ({ ...prev, payment_method: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.payment_method === 'card' 
                        ? 'border-[#00B4D8] bg-[#00B4D8]/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-[#00B4D8]" />
                        <div>
                          <h3 className="font-semibold text-[#CAF0F8]">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-400">Secure online payment</p>
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative">
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={form.payment_method === 'upi'}
                      onChange={(e) => setForm(prev => ({ ...prev, payment_method: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.payment_method === 'upi' 
                        ? 'border-[#00B4D8] bg-[#00B4D8]/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-6 w-6 text-[#00B4D8]" />
                        <div>
                          <h3 className="font-semibold text-[#CAF0F8]">UPI</h3>
                          <p className="text-sm text-gray-400">Instant payment</p>
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative">
                    <input
                      type="radio"
                      name="payment_method"
                      value="netbanking"
                      checked={form.payment_method === 'netbanking'}
                      onChange={(e) => setForm(prev => ({ ...prev, payment_method: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.payment_method === 'netbanking' 
                        ? 'border-[#00B4D8] bg-[#00B4D8]/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-[#00B4D8]" />
                        <div>
                          <h3 className="font-semibold text-[#CAF0F8]">Net Banking</h3>
                          <p className="text-sm text-gray-400">Direct bank transfer</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="bg-gray-900 border-[#00B4D8]">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special instructions or notes for delivery..."
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-[#CAF0F8] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-[#00B4D8] sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0] || '/first-aid.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#CAF0F8] text-sm truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#48CAE4] text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-[#CAF0F8]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-[#CAF0F8]">{formatPrice(shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (18% GST)</span>
                    <span className="text-[#CAF0F8]">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#48CAE4]">Total</span>
                      <span className="text-[#48CAE4]">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="pharma"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#03045E] border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Place Order • ${formatPrice(total)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage; 