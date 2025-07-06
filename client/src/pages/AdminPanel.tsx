import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { mockProducts, mockCategories } from '../lib/mockData';
import type { User, Order, Product } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CheckCircle, Users, ShoppingCart, Package, List, TrendingUp, Truck, Plane, AlertTriangle, Clock } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';

// Mock users
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@example.com',
    full_name: 'John Doe',
    role: 'customer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock orders with delivery type
const mockOrders: (Order & { delivery_type: 'normal' | 'drone', delivery_time_min: number })[] = [
  {
    id: '101',
    user_id: '2',
    user: mockUsers[1],
    status: 'delivered',
    total_amount: 250.0,
    shipping_address: {
      id: 'a1', user_id: '2', full_name: 'John Doe', phone: '1234567890', address_line1: '123 Main St', city: 'City', state: 'State', postal_code: '123456', country: 'India', is_default: true, created_at: new Date().toISOString()
    },
    billing_address: {
      id: 'a1', user_id: '2', full_name: 'John Doe', phone: '1234567890', address_line1: '123 Main St', city: 'City', state: 'State', postal_code: '123456', country: 'India', is_default: true, created_at: new Date().toISOString()
    },
    payment_method: 'cod',
    payment_status: 'paid',
    order_items: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    delivery_type: 'drone',
    delivery_time_min: 35,
  },
  {
    id: '102',
    user_id: '2',
    user: mockUsers[1],
    status: 'processing',
    total_amount: 120.0,
    shipping_address: {
      id: 'a2', user_id: '2', full_name: 'John Doe', phone: '1234567890', address_line1: '456 Main St', city: 'City', state: 'State', postal_code: '123456', country: 'India', is_default: false, created_at: new Date().toISOString()
    },
    billing_address: {
      id: 'a2', user_id: '2', full_name: 'John Doe', phone: '1234567890', address_line1: '456 Main St', city: 'City', state: 'State', postal_code: '123456', country: 'India', is_default: false, created_at: new Date().toISOString()
    },
    payment_method: 'card',
    payment_status: 'pending',
    order_items: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    delivery_type: 'normal',
    delivery_time_min: 90,
  },
  {
    id: '103',
    user_id: '2',
    user: mockUsers[1],
    status: 'pending',
    total_amount: 80.0,
    shipping_address: {
      id: 'a3', user_id: '2', full_name: 'John Doe', phone: '1234567890', address_line1: '789 Main St', city: 'City', state: 'State', postal_code: '123456', country: 'India', is_default: false, created_at: new Date().toISOString()
    },
    billing_address: {
      id: 'a3', user_id: '2', full_name: 'John Doe', phone: '1234567890', address_line1: '789 Main St', city: 'City', state: 'State', postal_code: '123456', country: 'India', is_default: false, created_at: new Date().toISOString()
    },
    payment_method: 'upi',
    payment_status: 'pending',
    order_items: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    delivery_type: 'drone',
    delivery_time_min: 40,
  },
];

// Inventory alerts
const lowStockProducts = mockProducts.filter(p => p.stock_quantity < 20);
const outOfStockProducts = mockProducts.filter(p => p.stock_quantity === 0);

// Analytics
const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total_amount, 0);
const droneOrders = mockOrders.filter(o => o.delivery_type === 'drone');
const normalOrders = mockOrders.filter(o => o.delivery_type === 'normal');
const avgDroneTime = droneOrders.length ? Math.round(droneOrders.reduce((sum, o) => sum + o.delivery_time_min, 0) / droneOrders.length) : 0;
const avgNormalTime = normalOrders.length ? Math.round(normalOrders.reduce((sum, o) => sum + o.delivery_time_min, 0) / normalOrders.length) : 0;

const statCards = [
  {
    label: 'Total Revenue',
    value: `₹${totalRevenue.toFixed(2)}`,
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
  },
  {
    label: 'Orders (Drone)',
    value: droneOrders.length,
    icon: <Plane className="h-6 w-6 text-blue-500" />,
  },
  {
    label: 'Orders (Normal)',
    value: normalOrders.length,
    icon: <Truck className="h-6 w-6 text-orange-500" />,
  },
  {
    label: 'Avg Drone Delivery',
    value: droneOrders.length ? `${avgDroneTime} min` : 'N/A',
    icon: <Clock className="h-6 w-6 text-blue-400" />,
  },
  {
    label: 'Avg Normal Delivery',
    value: normalOrders.length ? `${avgNormalTime} min` : 'N/A',
    icon: <Clock className="h-6 w-6 text-orange-400" />,
  },
  {
    label: 'Low Stock',
    value: lowStockProducts.length,
    icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
  },
  {
    label: 'Out of Stock',
    value: outOfStockProducts.length,
    icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
  },
  {
    label: 'Total Users',
    value: mockUsers.length,
    icon: <Users className="h-6 w-6 text-purple-500" />,
  },
];

const activityFeed = [
  { type: 'order', text: 'Order #101 delivered by drone', time: '5 min ago' },
  { type: 'order', text: 'Order #102 placed (normal delivery)', time: '30 min ago' },
  { type: 'stock', text: 'Ibuprofen 400mg stock low', time: '1 hr ago' },
  { type: 'user', text: 'New user John Doe registered', time: '2 hr ago' },
];

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { products, setProducts, refreshProducts } = useProducts();
  const navigate = useNavigate();

  // Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    prescription_required: false,
    is_active: true,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    is_active: true,
  });
  const [productSuccess, setProductSuccess] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState(false);

  // Categories state
  const [categories, setCategories] = useState(mockCategories);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Use API data if available, otherwise fall back to mock data
          setCategories(data.length > 0 ? data : mockCategories);
        } else {
          console.error('Failed to fetch categories, using mock data');
          setCategories(mockCategories);
        }
      } catch (error) {
        console.error('Error fetching categories, using mock data:', error);
        setCategories(mockCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  console.log('AdminPanel component loaded');
  console.log('Current user:', user);
  console.log('User role:', user?.role);
  console.log('Is user admin?', user?.role === 'admin');
  console.log('Local storage user:', localStorage.getItem('pharmafly_user'));

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  // Add Product handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('pharmafly_token');
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          category: productForm.category,
          stock_quantity: parseInt(productForm.stock_quantity),
          prescription_required: productForm.prescription_required,
          is_active: productForm.is_active,
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProductSuccess(true);
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: '',
          stock_quantity: '',
          prescription_required: false,
          is_active: true,
        });
        setShowProductModal(false);

        // Refresh products list to sync with ecommerce dashboard
        await refreshProducts();

        setTimeout(() => {
          setProductSuccess(false);
        }, 1200);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  // Add Category handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('pharmafly_token');
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryForm.name,
          description: categoryForm.description,
          is_active: categoryForm.is_active,
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [...prev, newCategory]);
        setCategorySuccess(true);
        setCategoryForm({
          name: '',
          description: '',
          is_active: true,
        });
        setShowCategoryModal(false);

        // Refresh categories list
        const refreshResponse = await fetch('http://localhost:3001/api/categories');
        if (refreshResponse.ok) {
          const refreshedCategories = await refreshResponse.json();
          setCategories(refreshedCategories.length > 0 ? refreshedCategories : mockCategories);
        }

        setTimeout(() => {
          setCategorySuccess(false);
        }, 1200);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  // If not admin, show access denied
  if (!isAdmin) {
    console.log('User is not admin, showing access denied');
    console.log('User exists:', !!user);
    console.log('User role check:', user?.role);
    console.log('Role comparison:', user?.role === 'admin');
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          
          {!user ? (
            <>
              <p className="text-gray-600 mb-4">You need to be logged in to access the admin panel.</p>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Register as Admin
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Current User:</strong> {user.full_name}<br/>
                  <strong>Email:</strong> {user.email}<br/>
                  <strong>Role:</strong> <span className="text-red-600">{user.role}</span>
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register as Admin
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  console.log('User is admin, showing admin panel');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.full_name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Add Product
            </button>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="mb-2">{stat.icon}</div>
              <div className="text-lg font-semibold text-gray-700">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <Card className="bg-white border border-gray-200 shadow-sm col-span-1 order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Recent platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {activityFeed.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {item.type === 'order' && <ShoppingCart className="h-5 w-5 text-blue-500" />}
                    {item.type === 'stock' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {item.type === 'user' && <Users className="h-5 w-5 text-purple-500" />}
                    <div>
                      <div className="font-medium text-gray-800">{item.text}</div>
                      <div className="text-xs text-gray-400">{item.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="bg-white border border-gray-200 shadow-sm col-span-2 order-1 lg:order-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders placed on the platform</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                    <th className="py-3 px-4 text-left font-semibold">User</th>
                    <th className="py-3 px-4 text-left font-semibold">Delivery</th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                    <th className="py-3 px-4 text-left font-semibold">Amount</th>
                    <th className="py-3 px-4 text-left font-semibold">Time</th>
                    <th className="py-3 px-4 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2 px-4">{order.id}</td>
                      <td className="py-2 px-4">{order.user.full_name}</td>
                      <td className="py-2 px-4">
                        <Badge variant={order.delivery_type === 'drone' ? 'pharma' : 'inStock'}>
                          {order.delivery_type === 'drone' ? 'Drone' : 'Normal'}
                        </Badge>
                      </td>
                      <td className="py-2 px-4">
                        <Badge variant={order.status === 'delivered' ? 'inStock' : 'pharma'}>{order.status}</Badge>
                      </td>
                      <td className="py-2 px-4">₹{order.total_amount.toFixed(2)}</td>
                      <td className="py-2 px-4">{order.delivery_time_min} min</td>
                      <td className="py-2 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="link" size="sm">View All Orders</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Products Table */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>All products in the catalog</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 text-left font-semibold">Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Category</th>
                    <th className="py-3 px-4 text-left font-semibold">Price</th>
                    <th className="py-3 px-4 text-left font-semibold">Stock</th>
                    <th className="py-3 px-4 text-left font-semibold">Prescription</th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 8).map((product) => (
                    <tr key={product._id || product.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{product.name}</td>
                      <td className="py-2 px-4">{product.category}</td>
                      <td className="py-2 px-4">₹{product.price.toFixed(2)}</td>
                      <td className="py-2 px-4">{product.stock_quantity}</td>
                      <td className="py-2 px-4">
                        <Badge variant={product.prescription_required ? 'prescription' : 'inStock'}>
                          {product.prescription_required ? 'Required' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-2 px-4">
                        <Badge variant={product.is_active ? 'inStock' : 'outOfStock'}>{product.is_active ? 'Active' : 'Inactive'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="link" size="sm">View All Products</Button>
            </CardFooter>
          </Card>

          {/* Categories Table */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>All product categories</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 text-left font-semibold">Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Description</th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 px-4 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-sm">No categories found</div>
                          <button
                            onClick={() => setShowCategoryModal(true)}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Add your first category
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    categories.slice(0, 8).map((cat) => (
                      <tr key={cat._id || cat.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">{cat.name}</td>
                        <td className="py-2 px-4">{cat.description}</td>
                        <td className="py-2 px-4">
                          <Badge variant={cat.is_active ? 'inStock' : 'outOfStock'}>{cat.is_active ? 'Active' : 'Inactive'}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="link" size="sm">View All Categories</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Inventory Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Low Stock */}
          <Card className="bg-white border border-yellow-200 shadow-sm">
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products with less than 20 units in stock</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="text-gray-500">No low stock products.</div>
              ) : (
                <ul className="space-y-2">
                  {lowStockProducts.map((p) => (
                    <li key={p._id || p.id} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-gray-500">({p.stock_quantity} left)</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          {/* Out of Stock */}
          <Card className="bg-white border border-red-200 shadow-sm">
            <CardHeader>
              <CardTitle>Out of Stock Products</CardTitle>
              <CardDescription>Products currently out of stock</CardDescription>
            </CardHeader>
            <CardContent>
              {outOfStockProducts.length === 0 ? (
                <div className="text-gray-500">No out of stock products.</div>
              ) : (
                <ul className="space-y-2">
                  {outOfStockProducts.map((p) => (
                    <li key={p._id || p.id} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{p.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <Modal open={showProductModal} onClose={() => setShowProductModal(false)} title={null}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">Add Product</h2>
            <div className="border-b border-gray-100 mb-4"></div>
            {productSuccess ? (
              <div className="text-center py-4">
                <div className="text-green-600 font-semibold mb-2">Product added successfully!</div>
                <div className="text-sm text-gray-600">The product is now available in the catalog.</div>
              </div>
            ) : (
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="product-name">Name</Label>
                  <Input 
                    id="product-name" 
                    value={productForm.name} 
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} 
                    required 
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" 
                    placeholder="Enter product name" 
                  />
                </div>
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Input 
                    id="product-description" 
                    value={productForm.description} 
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} 
                    required 
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" 
                    placeholder="Enter description" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-price">Price</Label>
                    <Input 
                      id="product-price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={productForm.price} 
                      onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} 
                      required 
                      className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-stock">Stock</Label>
                    <Input 
                      id="product-stock" 
                      type="number" 
                      min="0" 
                      value={productForm.stock_quantity} 
                      onChange={e => setProductForm(f => ({ ...f, stock_quantity: e.target.value }))} 
                      required 
                      className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" 
                      placeholder="0" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <select 
                    id="product-category" 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900" 
                    value={productForm.category} 
                    onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} 
                    required
                    disabled={loadingCategories}
                  >
                    <option value="">
                      {loadingCategories ? 'Loading categories...' : 'Select category'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat._id || cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && !loadingCategories && (
                    <p className="text-xs text-gray-500 mt-1">
                      No categories available. Please add a category first.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      id="product-prescription" 
                      type="checkbox" 
                      checked={productForm.prescription_required} 
                      onChange={e => setProductForm(f => ({ ...f, prescription_required: e.target.checked }))} 
                      className="accent-blue-500" 
                    />
                    <span className="text-sm text-gray-700">Prescription Required</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      id="product-active" 
                      type="checkbox" 
                      checked={productForm.is_active} 
                      onChange={e => setProductForm(f => ({ ...f, is_active: e.target.checked }))} 
                      className="accent-blue-500" 
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <Button type="submit" variant="pharma" className="w-full mt-2">Add Product</Button>
              </form>
            )}
          </div>
        </Modal>

        <Modal open={showCategoryModal} onClose={() => setShowCategoryModal(false)} title={null}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">Add Category</h2>
            <div className="border-b border-gray-100 mb-4"></div>
            {categorySuccess ? (
              <div className="text-center py-4">
                <div className="text-green-600 font-semibold mb-2">Category added successfully!</div>
                <div className="text-sm text-gray-600">The category is now available for products.</div>
              </div>
            ) : (
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Name</Label>
                  <Input 
                    id="category-name" 
                    value={categoryForm.name} 
                    onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))} 
                    required 
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" 
                    placeholder="Enter category name" 
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Input 
                    id="category-description" 
                    value={categoryForm.description} 
                    onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))} 
                    required 
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" 
                    placeholder="Enter description" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    id="category-active" 
                    type="checkbox" 
                    checked={categoryForm.is_active} 
                    onChange={e => setCategoryForm(f => ({ ...f, is_active: e.target.checked }))} 
                    className="accent-blue-500" 
                  />
                  <Label htmlFor="category-active" className="text-gray-700">Active</Label>
                </div>
                <Button type="submit" variant="pharma" className="w-full mt-2">Add Category</Button>
              </form>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPanel; 