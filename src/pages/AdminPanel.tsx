import React, { useState } from 'react';
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

  // For demo: local state for mock data
  const [products, setProducts] = useState(mockProducts);
  const [categories, setCategories] = useState(mockCategories);

  // Add Product handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([
      {
        id: Date.now().toString(),
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        originalPrice: undefined,
        category: productForm.category,
        subcategory: '',
        images: [],
        composition: '',
        dosage: '',
        manufacturer: '',
        prescription_required: productForm.prescription_required,
        stock_quantity: parseInt(productForm.stock_quantity),
        is_featured: false,
        is_active: productForm.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ...products,
    ]);
    setProductForm({
      name: '', description: '', price: '', category: '', stock_quantity: '', prescription_required: false, is_active: true,
    });
    setProductSuccess(true);
    setTimeout(() => {
      setShowProductModal(false);
      setProductSuccess(false);
    }, 1200);
  };

  // Add Category handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategories([
      {
        id: Date.now().toString(),
        name: categoryForm.name,
        description: categoryForm.description,
        image_url: '',
        is_active: categoryForm.is_active,
        created_at: new Date().toISOString(),
      },
      ...categories,
    ]);
    setCategoryForm({ name: '', description: '', is_active: true });
    setCategorySuccess(true);
    setTimeout(() => {
      setShowCategoryModal(false);
      setCategorySuccess(false);
    }, 1200);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
        <Card className="bg-white border-gray-200 shadow-xl">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-0 md:p-8">
      {/* Modals */}
      <Modal open={showProductModal} onClose={() => setShowProductModal(false)} title={null}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">Add Product</h2>
          <div className="border-b border-gray-100 mb-4"></div>
          {productSuccess ? (
            <div className="text-green-600 text-center font-semibold py-4">Product added successfully!</div>
          ) : (
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <Label htmlFor="product-name">Name</Label>
                <Input id="product-name" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="product-description">Description</Label>
                <Input id="product-description" value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} required className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" placeholder="Enter description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-price">Price</Label>
                  <Input id="product-price" type="number" min="0" step="0.01" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} required className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input id="product-stock" type="number" min="0" value={productForm.stock_quantity} onChange={e => setProductForm(f => ({ ...f, stock_quantity: e.target.value }))} required className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="product-category">Category</Label>
                <select id="product-category" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900" value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} required>
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input id="product-prescription" type="checkbox" checked={productForm.prescription_required} onChange={e => setProductForm(f => ({ ...f, prescription_required: e.target.checked }))} className="accent-blue-500" />
                  <span className="text-sm text-gray-700">Prescription Required</span>
                </label>
                <label className="flex items-center gap-2">
                  <input id="product-active" type="checkbox" checked={productForm.is_active} onChange={e => setProductForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-blue-500" />
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
            <div className="text-green-600 text-center font-semibold py-4">Category added successfully!</div>
          ) : (
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <Label htmlFor="category-name">Name</Label>
                <Input id="category-name" value={categoryForm.name} onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))} required className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" placeholder="Enter category name" />
              </div>
              <div>
                <Label htmlFor="category-description">Description</Label>
                <Input id="category-description" value={categoryForm.description} onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))} required className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400" placeholder="Enter description" />
              </div>
              <div className="flex items-center gap-2">
                <input id="category-active" type="checkbox" checked={categoryForm.is_active} onChange={e => setCategoryForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-blue-500" />
                <Label htmlFor="category-active" className="text-gray-700">Active</Label>
              </div>
              <Button type="submit" variant="pharma" className="w-full mt-2">Add Category</Button>
            </form>
          )}
        </div>
      </Modal>
      {/* Header */}
      <div className="px-4 pt-8 pb-4 md:px-0 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 md:mb-0">Admin Dashboard</h1>
          <p className="text-gray-500 text-base">Welcome, {user.full_name}. Manage your platform below.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="pharma" size="sm" onClick={() => setShowProductModal(true)}>Add Product</Button>
          <Button variant="pharmaOutline" size="sm" onClick={() => setShowCategoryModal(true)}>Add Category</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8 px-4 md:px-0">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-white border border-gray-200 shadow-sm flex flex-col items-center py-6">
            <div className="mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1 text-center">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
        {/* Activity Feed */}
        <Card className="bg-white border border-gray-200 shadow-sm col-span-1 order-2 md:order-1">
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
        <Card className="bg-white border border-gray-200 shadow-sm col-span-2 order-1 md:order-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 px-4 md:px-0">
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
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
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
                {categories.slice(0, 8).map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{cat.name}</td>
                    <td className="py-2 px-4">{cat.description}</td>
                    <td className="py-2 px-4">
                      <Badge variant={cat.is_active ? 'inStock' : 'outOfStock'}>{cat.is_active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="link" size="sm">View All Categories</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Inventory Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 px-4 md:px-0">
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
                  <li key={p.id} className="flex items-center gap-2">
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
                  <li key={p.id} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{p.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel; 