import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import User from '../models/User.js'; // Import the User model

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID.trim(),
  process.env.GOOGLE_CLIENT_SECRET.trim(),
  "http://localhost:3001/api/auth/google/callback"
);

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    if (!email || !password || !role || !name) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email and role already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      name,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({ success: true, message: 'User registered successfully', user: userWithoutPassword, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required'
      });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Google OAuth
router.get('/google', (req, res) => {
    const { role } = req.query;
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: JSON.stringify({ role })
    });

    res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
    const { code, state } = req.query;
    const { role } = JSON.parse(state);

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();

        let user = await User.findOne({ email: data.email, role });

        if (!user) {
            // Create new user if not found
            user = await User.create({
                email: data.email,
                name: data.name,
                role,
                googleId: data.id, // Store Google ID
                password: Math.random().toString(36).slice(-8), // Dummy password for Google users
            });
        } else if (!user.googleId) {
            // Link Google ID to existing user if not already linked
            user.googleId = data.id;
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.redirect(`http://localhost:5173/auth/google/callback?token=${token}&user=${JSON.stringify(userWithoutPassword)}`);

    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ success: false, message: 'Google OAuth error' });
    }
});

export default router;