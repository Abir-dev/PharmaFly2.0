import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building, Lock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils';

interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

interface PaymentData {
  orderId: string;
  amount: number;
  paymentMethod: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const [form, setForm] = useState<PaymentForm>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get payment data from location state
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
    } else {
      navigate('/checkout');
    }
  }, [user, navigate, location]);

  const handleInputChange = (field: keyof PaymentForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    handleInputChange('cardNumber', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real app, you would integrate with a payment gateway here
      // For now, we'll simulate a successful payment
      setPaymentSuccess(true);

      // Redirect to order success page after a delay
      setTimeout(() => {
        navigate(`/orders/${paymentData?.orderId}`, { 
          state: { paymentSuccess: true } 
        });
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading payment...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <Card className="bg-gray-900 border-[#00B4D8] max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#48CAE4] mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-4">
              Your payment has been processed successfully.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-400">Amount Paid</p>
              <p className="font-mono text-[#00B4D8] text-xl">{formatPrice(paymentData.amount)}</p>
            </div>
            <p className="text-sm text-gray-400">
              Redirecting to order details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderPaymentForm = () => {
    switch (paymentData.paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={form.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
              />
            </div>
            <div>
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                value={form.cardHolder}
                onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                placeholder="John Doe"
                required
                className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expiryMonth">Month</Label>
                <select
                  id="expiryMonth"
                  value={form.expiryMonth}
                  onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="expiryYear">Year</Label>
                <select
                  id="expiryYear"
                  value={form.expiryYear}
                  onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={form.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  required
                  className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
                />
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                value={form.upiId}
                onChange={(e) => handleInputChange('upiId', e.target.value)}
                placeholder="username@bank"
                required
                className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
              />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Popular UPI Apps</p>
              <div className="flex space-x-2">
                <div className="flex-1 bg-gray-700 p-2 rounded text-center text-xs text-[#CAF0F8]">
                  Google Pay
                </div>
                <div className="flex-1 bg-gray-700 p-2 rounded text-center text-xs text-[#CAF0F8]">
                  PhonePe
                </div>
                <div className="flex-1 bg-gray-700 p-2 rounded text-center text-xs text-[#CAF0F8]">
                  Paytm
                </div>
              </div>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Select Bank</Label>
              <select
                id="bankName"
                value={form.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="canara">Canara Bank</option>
                <option value="union">Union Bank of India</option>
              </select>
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={form.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="Enter account number"
                required
                className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
              />
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={form.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                placeholder="ABCD0001234"
                maxLength={11}
                required
                className="bg-gray-800 border-gray-700 text-[#CAF0F8]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getPaymentIcon = () => {
    switch (paymentData.paymentMethod) {
      case 'card':
        return <CreditCard className="h-6 w-6" />;
      case 'upi':
        return <Smartphone className="h-6 w-6" />;
      case 'netbanking':
        return <Building className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPaymentTitle = () => {
    switch (paymentData.paymentMethod) {
      case 'card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI Payment';
      case 'netbanking':
        return 'Net Banking';
      default:
        return 'Payment';
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/checkout')}
              className="text-[#00B4D8] hover:text-[#48CAE4]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkout
            </Button>
            <h1 className="text-3xl font-bold text-[#48CAE4]">Payment</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-[#00B4D8]">
              <CardHeader>
                <CardTitle className="text-[#48CAE4] flex items-center space-x-2">
                  {getPaymentIcon()}
                  <span>{getPaymentTitle()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderPaymentForm()}
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <Button
                    type="submit"
                    variant="pharma"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-[#03045E] border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Payment...</span>
                      </div>
                    ) : (
                      `Pay ${formatPrice(paymentData.amount)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card className="bg-gray-900 border-[#00B4D8]">
              <CardHeader>
                <CardTitle className="text-[#48CAE4]">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID:</span>
                    <span className="text-[#CAF0F8] font-mono">{paymentData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-[#CAF0F8] capitalize">{paymentData.paymentMethod}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-[#48CAE4]">Total Amount:</span>
                      <span className="text-[#48CAE4]">{formatPrice(paymentData.amount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 