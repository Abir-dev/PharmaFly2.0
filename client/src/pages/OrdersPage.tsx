import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, Calendar, Phone } from 'lucide-react';
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

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('pharmafly_token');
      const response = await fetch('http://localhost:3001/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
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

  const getStatusIcon = (status: Order['status']) => {
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

  const canCancelOrder = (status: Order['status']) => {
    return ['pending', 'confirmed'].includes(status);
  };

  const handleCancelOrder = async (orderId: string) => {
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
        // Refresh orders
        fetchOrders();
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
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#48CAE4] mb-2">Error Loading Orders</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button variant="pharma" onClick={fetchOrders}>
            Try Again
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
              onClick={() => navigate('/')}
              className="text-[#00B4D8] hover:text-[#48CAE4]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-[#48CAE4]">My Orders</h1>
            <Badge variant="pharma" className="text-sm">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </Badge>
          </div>
          <Link to="/products">
            <Button variant="pharma">
              Shop More
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-gray-900 border-[#00B4D8]">
            <CardContent className="p-12 text-center">
              <Package className="h-24 w-24 text-[#00B4D8] mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#48CAE4] mb-4">No Orders Yet</h2>
              <p className="text-gray-400 mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link to="/products">
                <Button variant="pharma" size="lg">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="bg-gray-900 border-[#00B4D8]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-[#48CAE4] text-lg">
                          Order #{order.order_number}
                        </CardTitle>
                        <p className="text-sm text-gray-400">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#48CAE4]">
                        {formatPrice(order.total_amount)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product_id?.images?.[0] || '/first-aid.jpg'}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#CAF0F8] truncate">
                            {item.product_name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity} × {formatPrice(item.product_price)}
                          </p>
                          {item.prescription_required && (
                            <Badge variant="prescription" className="text-xs mt-1">
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
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#48CAE4] flex items-center space-x-2">
                        <Truck className="h-4 w-4" />
                        <span>Delivery Information</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-[#00B4D8]" />
                          <span className="text-gray-400">Address:</span>
                          <span className="text-[#CAF0F8]">
                            {order.shipping_address.address_line1}, {order.shipping_address.city}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-[#00B4D8]" />
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-[#CAF0F8]">{order.shipping_address.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-[#00B4D8]" />
                          <span className="text-gray-400">Estimated Delivery:</span>
                          <span className="text-[#CAF0F8]">
                            {formatDate(order.estimated_delivery)}
                          </span>
                        </div>
                        {order.tracking_number && (
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-[#00B4D8]" />
                            <span className="text-gray-400">Tracking:</span>
                            <span className="text-[#CAF0F8] font-mono">{order.tracking_number}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment & Order Summary */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#48CAE4]">Order Summary</h4>
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
                          <span className="text-gray-400">Tax:</span>
                          <span className="text-[#CAF0F8]">{formatPrice(order.tax)}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-[#48CAE4]">Total:</span>
                            <span className="text-[#48CAE4]">{formatPrice(order.total_amount)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-gray-400">
                          Payment: <span className="text-[#CAF0F8] capitalize">{order.payment_method}</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Status: <span className="text-[#CAF0F8] capitalize">{order.payment_status}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="pharmaOutline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="pharmaOutline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order._id}/tracking`)}
                      >
                        Track Order
                      </Button>
                    </div>
                    {canCancelOrder(order.status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelOrder(order._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 