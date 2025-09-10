import express from 'express';
import axios from 'axios';
import Order from '../models/Order.js';
import Drone from '../models/Drone.js';
import User from '../models/User.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all orders or filter by status
router.get('/', protect, async (req, res) => {
  try {
    const { status, customerEmail } = req.query;
    let query = {};

    if (req.user.role === 'customer') {
      query.customerEmail = req.user.email;
    } else if (status) {
      query.status = status;
    }

    if (customerEmail && req.user.role === 'admin') {
      query.customerEmail = customerEmail;
    }

    const orders = await Order.find(query).populate('assignedDrone');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('assignedDrone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role === 'customer' && order.customerEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalWeight, pickupAddress, deliveryAddress } = req.body;

    if (!items || !totalWeight || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Load full user details to store name/email and link reference
    const customerUser = await User.findById(req.user.id);
    if (!customerUser) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const newOrder = new Order({
      customer: customerUser._id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      items,
      totalWeight,
      pickupAddress,
      deliveryAddress,
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    });

    await newOrder.save();

    // req.io.emit('newOrder', newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Approve or Deny order
router.patch('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });

    await order.save();

    res.json({ success: true, message: `Order ${status} successfully`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: `Failed to ${status} order` });
  }
});

// Assign drone to order
router.patch('/:id/assign-drone', protect, isAdmin, async (req, res) => {
  try {
    const { droneId } = req.body;
    const order = await Order.findById(req.params.id);
    const drone = await Drone.findById(droneId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!drone) {
      return res.status(404).json({ success: false, message: 'Drone not found' });
    }

    if (drone.status !== 'idle') {
      return res.status(400).json({ success: false, message: 'Drone is not available' });
    }

    if (drone.weightLimit < order.totalWeight) {
      return res.status(400).json({
        success: false,
        message: 'Drone capacity insufficient for this order',
      });
    }

    // Update order
    order.status = 'assigned';
    order.assignedDrone = droneId;
    order.statusHistory.push({ status: 'assigned', timestamp: new Date() });

    // Update drone
    drone.status = 'delivering';

    await order.save();
    await drone.save();

    // Send data to simulation server
    try {
      await axios.post('http://localhost:3000/simulation', {
        drone,
        order,
      });
      console.log('Successfully sent data to simulation server');
    } catch (simError) {
      console.error('Failed to send data to simulation server:', simError.message);
      // Optional: Decide if you want to revert the assignment if simulation fails
    }

    res.json({ success: true, message: 'Drone assigned successfully', order, drone });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to assign drone' });
  }
});

// Delete order
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
});

// Create a new order from an external source
router.post('/external', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    console.log('External order request:', {
      headers: req.headers,
      apiKey: apiKey,
      expectedKey: process.env.EXTERNAL_API_KEY,
      keyMatch: apiKey === process.env.EXTERNAL_API_KEY,
      body: req.body
    });

    if (apiKey !== process.env.EXTERNAL_API_KEY) {
      console.log('API key mismatch - Unauthorized');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { customerName, customerEmail, items, totalWeight, pickupAddress, deliveryAddress } = req.body;

    if (!customerName || !customerEmail || !items || !totalWeight || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Ensure the customer exists in our Users collection with role 'customer'
    let customerUser = await User.findOne({ email: customerEmail, role: 'customer' });
    if (!customerUser) {
      customerUser = await User.create({
        email: customerEmail,
        name: customerName,
        role: 'customer',
        // Create a random placeholder password; customer can set a real one later via reset
        password: Math.random().toString(36).slice(-10),
      });
    }

    const newOrder = new Order({
      customer: customerUser._id,
      customerName,
      customerEmail,
      items,
      totalWeight,
      pickupAddress,
      deliveryAddress,
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    });

    await newOrder.save();

    // req.io.emit('newOrder', newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order from external source:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

export default router;