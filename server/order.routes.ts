import express from 'express';
import { Order } from './order.model';
import Product from './product.model';
import { auth } from './middleware/auth';

const router = express.Router();

// Get all orders for a user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .populate('items.product_id', 'name images');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user_id: req.user._id 
    }).populate('items.product_id', 'name images');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      delivery_type = 'normal',
      shipping_address,
      billing_address,
      payment_method,
      notes
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shipping_address || !billing_address) {
      return res.status(400).json({ message: 'Shipping and billing addresses are required' });
    }

    if (!payment_method) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Calculate totals and validate items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product._id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        total_price: itemTotal,
        prescription_required: product.prescription_required
      });

      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock_quantity: -item.quantity }
      });
    }

    // Calculate fees
    const shipping_fee = delivery_type === 'drone' ? 100 : 50;
    const tax = subtotal * 0.18; // 18% GST
    const total_amount = subtotal + shipping_fee + tax;

    // Create order
    const order = new Order({
      user_id: req.user._id,
      delivery_type,
      delivery_time_min: delivery_type === 'drone' ? 45 : 90,
      items: orderItems,
      subtotal,
      shipping_fee,
      tax,
      total_amount,
      shipping_address,
      billing_address,
      payment_method,
      notes
    });

    const savedOrder = await order.save();
    
    // Populate product details for response
    await savedOrder.populate('items.product_id', 'name images');
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { status, tracking_number } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    order.status = status;
    if (tracking_number) {
      order.tracking_number = tracking_number;
    }

    // Set actual delivery time if status is delivered
    if (status === 'delivered' && !order.actual_delivery) {
      order.actual_delivery = new Date();
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate('items.product_id', 'name images');
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel order
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user_id: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    order.status = 'cancelled';
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock_quantity: item.quantity }
      });
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate('items.product_id', 'name images');
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get order tracking info
router.get('/:id/tracking', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user_id: req.user._id 
    }).select('order_number status delivery_type estimated_delivery actual_delivery tracking_number created_at');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Generate tracking timeline
    const timeline = [
      {
        status: 'Order Placed',
        timestamp: order.created_at,
        completed: true,
        description: `Order #${order.order_number} has been placed`
      },
      {
        status: 'Order Confirmed',
        timestamp: order.status !== 'pending' ? order.updated_at : null,
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status),
        description: 'Your order has been confirmed and is being processed'
      },
      {
        status: 'Processing',
        timestamp: ['processing', 'shipped', 'delivered'].includes(order.status) ? order.updated_at : null,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status),
        description: 'Your order is being prepared for delivery'
      },
      {
        status: 'Shipped',
        timestamp: ['shipped', 'delivered'].includes(order.status) ? order.updated_at : null,
        completed: ['shipped', 'delivered'].includes(order.status),
        description: `Your order is on its way via ${order.delivery_type} delivery`
      },
      {
        status: 'Delivered',
        timestamp: order.actual_delivery,
        completed: order.status === 'delivered',
        description: 'Your order has been delivered successfully'
      }
    ];

    res.json({
      order: {
        order_number: order.order_number,
        status: order.status,
        delivery_type: order.delivery_type,
        estimated_delivery: order.estimated_delivery,
        actual_delivery: order.actual_delivery,
        tracking_number: order.tracking_number
      },
      timeline
    });
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all orders (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const orders = await Order.find()
      .sort({ created_at: -1 })
      .populate('user_id', 'full_name email')
      .populate('items.product_id', 'name images');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 