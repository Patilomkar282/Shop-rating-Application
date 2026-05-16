import type { Response } from 'express';
import pool from '../config/db.js';

export const getOwnerDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    // Profile
    const [users]: any = await pool.query('SELECT name, email, address, role FROM users WHERE id = ?', [userId]);
    const profile = users[0];

    // Stats
    const [[{ totalStores }]]: any = await pool.query('SELECT COUNT(*) as totalStores FROM stores WHERE owner_id = ?', [userId]);
    const [[{ totalRatings, averageRating }]]: any = await pool.query(`
      SELECT COUNT(r.id) as totalRatings, AVG(r.rating) as averageRating 
      FROM ratings r 
      JOIN stores s ON r.store_id = s.id 
      WHERE s.owner_id = ?
    `, [userId]);

    // Recent Ratings
    const [recentRatings] = await pool.query(`
      SELECT r.rating, r.created_at as date, u.name as userName, s.name as storeName 
      FROM ratings r 
      JOIN stores s ON r.store_id = s.id 
      JOIN users u ON r.user_id = u.id 
      WHERE s.owner_id = ? 
      ORDER BY r.created_at DESC 
      LIMIT 5
    `, [userId]);

    res.json({
      profile,
      stats: { 
        totalStores, 
        totalRatings, 
        averageRating: averageRating || 0 
      },
      recentRatings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOwnerRatings = async (req: any, res: Response) => {
  try {
    // Get all users who rated their store and what they rated
    const [ratings] = await pool.query(`
      SELECT r.id, r.rating, r.created_at, u.name as userName, u.email as userEmail, s.name as storeName 
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = ?
    `, [req.user.id]);
    
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
