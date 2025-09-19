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

/**
 * Handles incoming real-time location updates for a drone from the simulation service.
 * This handler is exported to be used by multiple endpoint paths defined in server.js.
 */
export const updateLocationHandler = async (req, res) => {
  try {
    console.log('📡 Received location update request:', JSON.stringify(req.body, null, 2));
    
    const { serialNumber, latitude, longitude, batteryCapacity, droneStatus, timestamp } = req.body;

    if (!serialNumber || latitude === undefined || longitude === undefined) {
      console.log('❌ Missing required location data:', { serialNumber, latitude, longitude });
      return res.status(400).json({ success: false, message: 'Missing required location data' });
    }

    const updateData = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    if (batteryCapacity !== undefined) {
      updateData.batteryCapacity = parseFloat(batteryCapacity);
    }
    // Map incoming 'active' status to 'delivering' for internal consistency
    if (droneStatus !== undefined) {
      updateData.status = droneStatus === 'active' ? 'delivering' : droneStatus;
    }

    console.log('📝 Update data prepared:', updateData);

    const drone = await Drone.findOneAndUpdate(
      { serialNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!drone) {
      console.log(`❌ Drone with serialNumber ${serialNumber} not found in database`);
      return res.status(404).json({ success: false, message: `Drone with serial number ${serialNumber} not found` });
    }

    console.log('✅ Drone updated successfully:', {
      serialNumber: drone.serialNumber,
      latitude: drone.latitude,
      longitude: drone.longitude,
      batteryCapacity: drone.batteryCapacity,
      status: drone.status,
    });

    // Broadcast the location update if io is available
    req.io?.emit('droneLocationUpdate', {
      droneId: drone._id.toString(),
      serialNumber: drone.serialNumber,
      latitude: drone.latitude,
      longitude: drone.longitude,
      batteryCapacity: drone.batteryCapacity,
      timestamp: timestamp || new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Location updated successfully',
      drone: {
        id: drone._id,
        serialNumber: drone.serialNumber,
        name: drone.name,
        model: drone.model,
        latitude: drone.latitude,
        longitude: drone.longitude,
        batteryCapacity: drone.batteryCapacity,
        status: drone.status,
        updatedAt: drone.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Error updating drone location:', error);
    res.status(500).json({ success: false, message: 'Failed to update location', error: error.message });
  }
};

export default router;