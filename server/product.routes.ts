import express from 'express';
import Product from './product.model';
import { auth } from './middleware/auth';
import dbConnect from './lib/db';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  await dbConnect();
  try {
    const products = await Product.find().sort({ created_at: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  await dbConnect();
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product (admin only)
router.post('/', auth, async (req, res) => {
  await dbConnect();
  try {
    const product = new Product({ ...req.body });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add product', details: err });
  }
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  await dbConnect();
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product', details: err });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  await dbConnect();
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product', details: err });
  }
});

export default router; 