import express from 'express';
import { appData } from '../data/mockData.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all orders or filter by status
router.get('/', protect, (req, res) => {
  try {
    const { status, customerEmail } = req.query;
    let filteredOrders = appData.orders;

    if (req.user.role === 'customer') {
        // Customers can only see their own orders
        filteredOrders = filteredOrders.filter(order => order.customerEmail === req.user.email);
    } else if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (customerEmail && req.user.role === 'admin') {
      filteredOrders = filteredOrders.filter(order => order.customerEmail === customerEmail);
    }

    res.json({
      success: true,
      orders: filteredOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get order by ID
router.get('/:id', protect, (req, res) => {
  try {
    const order = appData.orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (req.user.role === 'customer' && order.customerEmail !== req.user.email) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Create a new order
router.post('/', protect, (req, res) => {
    try {
        const { items, totalWeight, pickupAddress, deliveryAddress } = req.body;

        if (!items || !totalWeight || !pickupAddress || !deliveryAddress) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newOrder = {
            id: `ORD${Date.now().toString().slice(-3)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            customerId: req.user.id,
            customerName: req.user.name,
            customerEmail: req.user.email,
            items,
            totalWeight,
            pickupAddress,
            deliveryAddress,
            status: 'pending',
            assignedDrone: null,
            estimatedDelivery: null,
            createdAt: new Date().toISOString(),
            statusHistory: [
                { status: 'pending', timestamp: new Date().toISOString() }
            ]
        };

        appData.orders.push(newOrder);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
});

// Approve order
router.patch('/:id/approve', protect, isAdmin, (req, res) => {
  try {
    const orderIndex = appData.orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    appData.orders[orderIndex].status = 'approved';
    appData.orders[orderIndex].statusHistory.push({
      status: 'approved',
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Order approved successfully',
      order: appData.orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve order'
    });
  }
});

// Assign drone to order
router.patch('/:id/assign-drone', protect, isAdmin, (req, res) => {
  try {
    const { droneId } = req.body;
    const orderIndex = appData.orders.findIndex(o => o.id === req.params.id);
    const droneIndex = appData.drones.findIndex(d => d.id === droneId);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (droneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Drone not found'
      });
    }

    const order = appData.orders[orderIndex];
    const drone = appData.drones[droneIndex];

    if (drone.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Drone is not available'
      });
    }

    if (drone.maxWeight < order.totalWeight) {
      return res.status(400).json({
        success: false,
        message: 'Drone capacity insufficient for this order'
      });
    }

    // Update order
    order.status = 'assigned';
    order.assignedDrone = droneId;
    order.estimatedDelivery = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    order.statusHistory.push({
      status: 'assigned',
      timestamp: new Date().toISOString()
    });

    // Update drone
    drone.status = 'in-transit';
    drone.assignedOrder = order.id;

    // Simulate drone starting journey after 2 seconds
    setTimeout(() => {
      const currentOrder = appData.orders.find(o => o.id === order.id);
      if (currentOrder && currentOrder.status === 'assigned') {
        currentOrder.status = 'in-transit';
        currentOrder.statusHistory.push({
          status: 'in-transit',
          timestamp: new Date().toISOString()
        });
      }
    }, 2000);

    res.json({
      success: true,
      message: 'Drone assigned successfully',
      order,
      drone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign drone'
    });
  }
});

// Delete order (deny)
router.delete('/:id', protect, isAdmin, (req, res) => {
  try {
    const orderIndex = appData.orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    appData.orders.splice(orderIndex, 1);

    res.json({
      success: true,
      message: 'Order denied and removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
});

export default router;
