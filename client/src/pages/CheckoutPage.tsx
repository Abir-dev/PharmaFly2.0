import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils';
import { mockPaymentMethods } from '../lib/mockData';

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    paymentMethod: 'cod',
    saveAddress: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.line1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setOrderPlaced(true);
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#48CAE4] mb-4">Your cart is empty</h2>
          <Button variant="pharma" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#48CAE4] mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-400 mb-6">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <div className="bg-gray-900 p-4 rounded-lg border border-[#00B4D8] mb-6">
            <p className="text-sm text-gray-400">Order ID: ORD-{Date.now()}</p>
            <p className="text-sm text-gray-400">Total: {formatPrice(total)}</p>
          </div>
          <p className="text-sm text-gray-400">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8]">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-[#00B4D8] text-[#03045E]' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-[#00B4D8]' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <Card className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <CardTitle className="text-[#48CAE4]">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full p-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] ${
                          errors.fullName ? 'border-red-500' : 'border-[#00B4D8]'
                        }`}
                      />
                      {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full p-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] ${
                          errors.email ? 'border-red-500' : 'border-[#00B4D8]'
                        }`}
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full p-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] ${
                        errors.phone ? 'border-red-500' : 'border-[#00B4D8]'
                      }`}
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep === 2 && (
              <Card className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <CardTitle className="text-[#48CAE4]">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Address Line 1</label>
                    <input
                      type="text"
                      value={formData.address.line1}
                      onChange={(e) => handleInputChange('address.line1', e.target.value)}
                      className={`w-full p-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] ${
                        errors.addressLine1 ? 'border-red-500' : 'border-[#00B4D8]'
                      }`}
                    />
                    {errors.addressLine1 && <p className="text-red-400 text-sm mt-1">{errors.addressLine1}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={formData.address.line2}
                      onChange={(e) => handleInputChange('address.line2', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-[#00B4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        className={`w-full p-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] ${
                          errors.city ? 'border-red-500' : 'border-[#00B4D8]'
                        }`}
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        className={`w-full p-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] ${
                          errors.state ? 'border-red-500' : 'border-[#00B4D8]'
                        }`}
                      />
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.address.postalCode}
                        onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                        className={`w-full p-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] ${
                          errors.postalCode ? 'border-red-500' : 'border-[#00B4D8]'
                        }`}
                      />
                      {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <Card className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <CardTitle className="text-[#48CAE4]">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockPaymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.paymentMethod === method.type
                          ? 'border-[#00B4D8] bg-[#00B4D8]/10'
                          : 'border-gray-700 hover:border-[#00B4D8]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.type}
                        checked={formData.paymentMethod === method.type}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="text-[#00B4D8] focus:ring-[#00B4D8] mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#CAF0F8]">{method.name}</p>
                            <p className="text-sm text-gray-400">{method.description}</p>
                          </div>
                          <CreditCard className="h-5 w-5 text-[#00B4D8]" />
                        </div>
                      </div>
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button
                  variant="pharmaOutline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <Button variant="pharma" onClick={handleNextStep}>
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="pharma"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-[#03045E] border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Place Order - ${formatPrice(total)}`
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-[#00B4D8] sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
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
                        <p className="text-sm font-medium text-[#CAF0F8] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[#48CAE4]">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-[#00B4D8] pt-4 space-y-2">
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
                  <div className="border-t border-[#00B4D8] pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-[#48CAE4]">Total</span>
                      <span className="text-lg font-semibold text-[#48CAE4]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-4 w-4 text-[#00B4D8]" />
                    <span className="text-sm font-medium text-[#CAF0F8]">Delivery</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Estimated delivery: 2-3 business days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 