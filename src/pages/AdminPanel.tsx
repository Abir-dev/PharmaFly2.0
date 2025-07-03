import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, TABLES } from '../lib/supabase/client';
import { Button } from '../components/ui/button';
import Modal from '../components/ui/Modal';


interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  // Access control
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // User modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<Partial<User>>({});

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  // Fetch users and products, subscribe to realtime
  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from(TABLES.USERS).select('*').order('created_at', { ascending: false }),
      supabase.from(TABLES.PRODUCTS).select('*').order('created_at', { ascending: false })
    ]).then(([usersRes, productsRes]) => {
      if (usersRes.error) setError(usersRes.error.message);
      else setUsers(usersRes.data || []);
      if (productsRes.error) setError(productsRes.error.message);
      else setProducts(productsRes.data || []);
      setLoading(false);
    });
    // Real-time subscriptions
    const usersSub = supabase
      .channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.USERS }, () => {
        supabase.from(TABLES.USERS).select('*').order('created_at', { ascending: false }).then(res => setUsers(res.data || []));
      })
      .subscribe();
    const productsSub = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.PRODUCTS }, () => {
        supabase.from(TABLES.PRODUCTS).select('*').order('created_at', { ascending: false }).then(res => setProducts(res.data || []));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(usersSub);
      supabase.removeChannel(productsSub);
    };
  }, []);

  // User CRUD
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({});
    setShowUserModal(true);
  };
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm(user);
    setShowUserModal(true);
  };
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    const { error } = await supabase.from(TABLES.USERS).delete().eq('id', id);
    if (error) setActionMsg(error.message);
    else setActionMsg('User deleted');
  };
  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };
  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Update
      const { error } = await supabase.from(TABLES.USERS).update(userForm).eq('id', editingUser.id);
      if (error) setActionMsg(error.message);
      else setActionMsg('User updated');
    } else {
      // Add
      const { error } = await supabase.from(TABLES.USERS).insert([{ ...userForm }]);
      if (error) setActionMsg(error.message);
      else setActionMsg('User added');
    }
    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({});
  };

  // Product CRUD
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({});
    setShowProductModal(true);
  };
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductModal(true);
  };
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    const { error } = await supabase.from(TABLES.PRODUCTS).delete().eq('id', id);
    if (error) setActionMsg(error.message);
    else setActionMsg('Product deleted');
  };
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      const { error } = await supabase.from(TABLES.PRODUCTS).update(productForm).eq('id', editingProduct.id);
      if (error) setActionMsg(error.message);
      else setActionMsg('Product updated');
    } else {
      // Add
      const { error } = await supabase.from(TABLES.PRODUCTS).insert([{ ...productForm, price: Number(productForm.price), stock_quantity: Number(productForm.stock_quantity) }]);
      if (error) setActionMsg(error.message);
      else setActionMsg('Product added');
    }
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({});
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      {actionMsg && <div className="mb-4 text-green-600 dark:text-green-400">{actionMsg}</div>}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">User Management
          <Button variant="pharma" size="sm" onClick={handleAddUser}>Add User</Button>
        </h2>
        <div className="bg-gray-100 dark:bg-zinc-800 rounded p-4">
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-2 flex justify-between items-center">
                <span>{user.full_name} ({user.email}) - {user.role}</span>
                <div className="flex gap-2">
                  <Button variant="pharmaOutline" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                  <Button variant="pharmaOutline" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">Product Management
          <Button variant="pharma" size="sm" onClick={handleAddProduct}>Add Product</Button>
        </h2>
        <div className="bg-gray-100 dark:bg-zinc-800 rounded p-4">
          <ul>
            {products.map(product => (
              <li key={product.id} className="mb-2 flex justify-between items-center">
                <span>{product.name} - ₹{product.price} (Stock: {product.stock_quantity})</span>
                <div className="flex gap-2">
                  <Button variant="pharmaOutline" size="sm" onClick={() => handleEditProduct(product)}>Edit</Button>
                  <Button variant="pharmaOutline" size="sm" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* User Modal */}
      <Modal open={showUserModal} onClose={() => setShowUserModal(false)} title={editingUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleUserFormSubmit} className="flex flex-col gap-4">
          <input name="full_name" value={userForm.full_name || ''} onChange={handleUserFormChange} placeholder="Full Name" className="p-2 rounded border" required />
          <input name="email" value={userForm.email || ''} onChange={handleUserFormChange} placeholder="Email" className="p-2 rounded border" required />
          <select name="role" value={userForm.role || 'customer'} onChange={handleUserFormChange} className="p-2 rounded border">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-2 justify-end">
            <Button variant="pharmaOutline" type="button" onClick={() => setShowUserModal(false)}>Cancel</Button>
            <Button variant="pharma" type="submit">Save</Button>
          </div>
        </form>
      </Modal>
      {/* Product Modal */}
      <Modal open={showProductModal} onClose={() => setShowProductModal(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleProductFormSubmit} className="flex flex-col gap-4">
          <input name="name" value={productForm.name || ''} onChange={handleProductFormChange} placeholder="Name" className="p-2 rounded border" required />
          <textarea name="description" value={productForm.description || ''} onChange={handleProductFormChange} placeholder="Description" className="p-2 rounded border" />
          <input name="price" value={productForm.price || ''} onChange={handleProductFormChange} placeholder="Price" className="p-2 rounded border" required type="number" />
          <input name="stock_quantity" value={productForm.stock_quantity || ''} onChange={handleProductFormChange} placeholder="Stock" className="p-2 rounded border" required type="number" />
          <input name="image_url" value={productForm.image_url || ''} onChange={handleProductFormChange} placeholder="Image URL" className="p-2 rounded border" />
          <div className="flex gap-2 justify-end">
            <Button variant="pharmaOutline" type="button" onClick={() => setShowProductModal(false)}>Cancel</Button>
            <Button variant="pharma" type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPanel; 