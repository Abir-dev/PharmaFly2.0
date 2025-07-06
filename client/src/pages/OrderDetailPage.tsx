import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, Calendar, Phone, FileText, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils';

interface OrderItem {
  product_id: {
    _id: string;
    name: string;
    images: string[];
  };
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  prescription_required: boolean;
}

interface Address {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Order {
  _id: string;
  order_number: string;
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
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface TrackingInfo {
  order: {
    order_number: string;
    status: string;
    delivery_type: string;
    estimated_delivery: string;
    actual_delivery?: string;
    tracking_number?: string;
  };
  timeline: Array<{
    status: string;
    timestamp: string | null;
    completed: boolean;
    description: string;
  }>;
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'tracking'>('details');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (orderId) {
      fetchOrderDetails();
      fetchTrackingInfo();
    }
  }, [user, orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('pharmafly_token');
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async () => {
    try {
      const token = localStorage.getItem('pharmafly_token');
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrackingInfo(data);
      }
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'shipped':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancelOrder = (status: string) => {
    return ['pending', 'confirmed'].includes(status);
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = localStorage.getItem('pharmafly_token');
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh order details
        fetchOrderDetails();
        fetchTrackingInfo();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#48CAE4] mb-2">Error Loading Order</h2>
          <p className="text-gray-400 mb-4">{error || 'Order not found'}</p>
          <Button variant="pharma" onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/orders')}
              className="text-[#00B4D8] hover:text-[#48CAE4]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#48CAE4]">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-400">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            {canCancelOrder(order.status) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelOrder}
                className="text-red-400 hover:text-red-300"
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-900 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'bg-[#00B4D8] text-[#03045E]'
                : 'text-gray-400 hover:text-[#CAF0F8]'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Order Details
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tracking'
                ? 'bg-[#00B4D8] text-[#03045E]'
                : 'text-gray-400 hover:text-[#CAF0F8]'
            }`}
          >
            <Truck className="h-4 w-4 inline mr-2" />
            Track Order
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <CardTitle className="text-[#48CAE4]">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                      <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product_id?.images?.[0] || '/first-aid.jpg'}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#CAF0F8] mb-1">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          Qty: {item.quantity} × {formatPrice(item.product_price)}
                        </p>
                        {item.prescription_required && (
                          <Badge variant="prescription" className="text-xs">
                            Prescription Required
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#48CAE4]">
                          {formatPrice(item.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-[#00B4D8]">
                  <CardHeader>
                    <CardTitle className="text-[#48CAE4] flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Shipping Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="font-medium text-[#CAF0F8]">{order.shipping_address.full_name}</p>
                    <p className="text-gray-400">{order.shipping_address.phone}</p>
                    <p className="text-[#CAF0F8]">{order.shipping_address.address_line1}</p>
                    {order.shipping_address.address_line2 && (
                      <p className="text-[#CAF0F8]">{order.shipping_address.address_line2}</p>
                    )}
                    <p className="text-[#CAF0F8]">
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                    <p className="text-[#CAF0F8]">{order.shipping_address.country}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-[#00B4D8]">
                  <CardHeader>
                    <CardTitle className="text-[#48CAE4] flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Billing Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="font-medium text-[#CAF0F8]">{order.billing_address.full_name}</p>
                    <p className="text-gray-400">{order.billing_address.phone}</p>
                    <p className="text-[#CAF0F8]">{order.billing_address.address_line1}</p>
                    {order.billing_address.address_line2 && (
                      <p className="text-[#CAF0F8]">{order.billing_address.address_line2}</p>
                    )}
                    <p className="text-[#CAF0F8]">
                      {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                    </p>
                    <p className="text-[#CAF0F8]">{order.billing_address.country}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              {order.notes && (
                <Card className="bg-gray-900 border-[#00B4D8]">
                  <CardHeader>
                    <CardTitle className="text-[#48CAE4]">Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#CAF0F8]">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <CardTitle className="text-[#48CAE4]">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-[#CAF0F8]">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping:</span>
                      <span className="text-[#CAF0F8]">{formatPrice(order.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax (18% GST):</span>
                      <span className="text-[#CAF0F8]">{formatPrice(order.tax)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-[#48CAE4]">Total:</span>
                        <span className="text-[#48CAE4]">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <CardTitle className="text-[#48CAE4]">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method:</span>
                    <span className="text-[#CAF0F8] capitalize">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className={getStatusColor(order.payment_status)}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <CardTitle className="text-[#48CAE4]">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-[#CAF0F8] capitalize">{order.delivery_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-[#CAF0F8]">{order.delivery_time_min} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated:</span>
                    <span className="text-[#CAF0F8]">{formatDate(order.estimated_delivery)}</span>
                  </div>
                  {order.actual_delivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivered:</span>
                      <span className="text-[#CAF0F8]">{formatDate(order.actual_delivery)}</span>
                    </div>
                  )}
                  {order.tracking_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tracking:</span>
                      <span className="text-[#CAF0F8] font-mono">{order.tracking_number}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Tracking Tab */
          <Card className="bg-gray-900 border-[#00B4D8]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#48CAE4]">Order Tracking</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchTrackingInfo}
                  className="text-[#00B4D8] hover:text-[#48CAE4]"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {trackingInfo ? (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400">Order Number</p>
                      <p className="font-mono text-[#CAF0F8]">{trackingInfo.order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <Badge className={getStatusColor(trackingInfo.order.status)}>
                        {trackingInfo.order.status.charAt(0).toUpperCase() + trackingInfo.order.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Delivery Type</p>
                      <p className="text-[#CAF0F8] capitalize">{trackingInfo.order.delivery_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Estimated Delivery</p>
                      <p className="text-[#CAF0F8]">{formatDate(trackingInfo.order.estimated_delivery)}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#48CAE4]">Tracking Timeline</h3>
                    <div className="space-y-4">
                      {trackingInfo.timeline.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.completed
                              ? 'bg-[#00B4D8] text-[#03045E]'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium ${
                              step.completed ? 'text-[#CAF0F8]' : 'text-gray-400'
                            }`}>
                              {step.status}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {step.description}
                            </p>
                            {step.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(step.timestamp)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Loading tracking information...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage; 