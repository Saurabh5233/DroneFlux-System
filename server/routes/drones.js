import express from 'express';
import Drone from '../models/Drone.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all drones
router.get('/', async (req, res) => {
  try {
    const drones = await Drone.find();
    res.json({ success: true, drones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch drones' });
  }
});

// Get drone by ID
router.get('/:id', async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Drone not found' });
    }
    res.json({ success: true, drone });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch drone' });
  }
});

// Add new drone
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name, model, serialNumber, batteryCapacity, weightLimit } = req.body;

    if (!name || !model || !serialNumber || !batteryCapacity || !weightLimit) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const newDrone = new Drone({
      name,
      model,
      serialNumber,
      batteryCapacity,
      weightLimit,
    });

    await newDrone.save();

    res.status(201).json({
      success: true,
      message: 'Drone added successfully',
      drone: newDrone,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add drone' });
  }
});

// Update drone status
router.patch('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const drone = await Drone.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!drone) {
      return res.status(404).json({ success: false, message: 'Drone not found' });
    }

    res.json({ success: true, message: 'Drone status updated', drone });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update drone status' });
  }
});

// Delete a drone
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const drone = await Drone.findByIdAndDelete(req.params.id);

    if (!drone) {
      return res.status(404).json({ success: false, message: 'Drone not found' });
    }

    res.json({ success: true, message: 'Drone deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete drone' });
  }
});

// Update drone location from simulation
router.post('/location', async (req, res) => {
  try {
    const { serialNumber, latitude, longitude, batteryCapacity } = req.body;

    if (!serialNumber || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required location data' });
    }

    const drone = await Drone.findOneAndUpdate(
      { serialNumber },
      {
        latitude,
        longitude,
        batteryCapacity,
      },
      { new: true }
    );

    if (!drone) {
      return res.status(404).json({ success: false, message: 'Drone not found' });
    }

    // Broadcast the location update
    req.io.emit('droneLocationUpdate', { droneId: drone._id, latitude, longitude, batteryCapacity });

    res.json({ success: true, message: 'Location updated', drone });
  } catch (error) {
    console.error('Error updating drone location:', error);
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

export default router;