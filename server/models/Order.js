import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for external orders
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  items: [{
    name: String,
    quantity: Number,
  }],
  totalWeight: {
    type: Number,
    required: true,
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'assigned', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  assignedDrone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone',
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  estimatedTimeRemaining: {
    type: Number, // in minutes
    default: null,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
