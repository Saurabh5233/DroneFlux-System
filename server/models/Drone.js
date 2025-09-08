import mongoose from 'mongoose';

const droneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  batteryCapacity: {
    type: Number,
    required: true,
  },
  weightLimit: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['idle', 'delivering', 'returning', 'charging', 'maintenance'],
    default: 'idle',
  },
  latitude: {
    type: Number,
    default: 0,
  },
  longitude: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Drone = mongoose.model('Drone', droneSchema);

export default Drone;
