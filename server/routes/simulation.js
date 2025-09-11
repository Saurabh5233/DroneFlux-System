import express from 'express';

// In-memory store for the latest simulation data
let latestSimulation = null;

const router = express.Router();

// GET /api/simulation - return current simulation data
router.get('/', async (req, res) => {
  try {
    if (!latestSimulation) {
      return res.status(404).json({ success: false, message: 'No simulation data available' });
    }
    res.json({ success: true, ...latestSimulation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch simulation data' });
  }
});

// POST /api/simulation/start - start or update simulation data
router.post('/start', async (req, res) => {
  try {
    const { order, drone } = req.body || {};

    if (!order || !drone) {
      return res.status(400).json({ success: false, message: 'Order and drone are required' });
    }

    latestSimulation = { order, drone };

    res.status(201).json({ success: true, message: 'Simulation started', ...latestSimulation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to start simulation' });
  }
});

// POST /api/simulation/push - optional trigger to regenerate data (mock)
router.post('/push', async (req, res) => {
  try {
    if (!latestSimulation) {
      return res.status(400).json({ success: false, message: 'No active simulation to push' });
    }
    // Just echo back current state; real logic could regenerate data
    res.json({ success: true, message: 'Simulation data pushed', ...latestSimulation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to push simulation data' });
  }
});

export default router;

