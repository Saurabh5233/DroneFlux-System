import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } }, // Password not required if googleId exists
  role: { type: String, required: true, enum: ['customer', 'admin'] },
  name: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;