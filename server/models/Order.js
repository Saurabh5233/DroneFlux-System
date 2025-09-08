import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
