import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js'; // Important: include .js extension for ES modules

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);

// Basic health check route
app.get('/health', async (req, res) => {
  try {
    // Test the database connection
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Server is running and Database is connected!' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

import { initDB } from './db/init.js';

// Start the server
const startServer = async () => {
  // Initialize Database Tables
  await initDB();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

startServer();
