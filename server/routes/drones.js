import express from 'express';
import { appData } from '../data/mockData.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all drones
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      drones: appData.drones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drones'
    });
  }
});

// Get drone by ID
router.get('/:id', (req, res) => {
  try {
    const drone = appData.drones.find(d => d.id === req.params.id);
    
    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone not found'
      });
    }

    res.json({
      success: true,
      drone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drone'
    });
  }
});

// Add new drone
router.post('/', protect, isAdmin, (req, res) => {
  try {
    const { name, type, maxWeight } = req.body;

    if (!name || !type || !maxWeight) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, and maxWeight are required'
      });
    }

    const newDrone = {
      id: `DRONE${Date.now().toString().slice(-3)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name,
      type,
      status: 'available',
      battery: Math.floor(Math.random() * 40) + 60,
      maxWeight: parseInt(maxWeight),
      currentLocation: {
        lat: 19.0760 + (Math.random() - 0.5) * 0.02,
        lng: 72.8777 + (Math.random() - 0.5) * 0.02
      },
      assignedOrder: null
    };

    appData.drones.push(newDrone);

    res.status(201).json({
      success: true,
      message: 'Drone added successfully',
      drone: newDrone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add drone'
    });
  }
});

// Update drone status
router.patch('/:id/status', protect, isAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const droneIndex = appData.drones.findIndex(d => d.id === req.params.id);

    if (droneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Drone not found'
      });
    }

    appData.drones[droneIndex].status = status;

    res.json({
      success: true,
      message: 'Drone status updated',
      drone: appData.drones[droneIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update drone status'
    });
  }
});

export default router;
