import type { Response } from 'express';
import pool from '../config/db.js';

export const getUserDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    // 1. Profile Summary
    const [users]: any = await pool.query('SELECT name, email, address, role FROM users WHERE id = ?', [userId]);
    const profile = users[0];

    // 2. Quick Stats
    const [[{ totalStores }]]: any = await pool.query('SELECT COUNT(*) as totalStores FROM stores');
    const [[{ myRatings }]]: any = await pool.query('SELECT COUNT(*) as myRatings FROM ratings WHERE user_id = ?', [userId]);
    const pendingRatings = totalStores - myRatings;

    // 3. Recent Ratings
    const [recentRatings] = await pool.query(`
      SELECT s.name as storeName, r.rating, r.created_at as date 
      FROM ratings r 
      JOIN stores s ON r.store_id = s.id 
      WHERE r.user_id = ? 
      ORDER BY r.created_at DESC 
      LIMIT 5
    `, [userId]);

    // 4. Top Stores
    const [topStores] = await pool.query(`
      SELECT s.name as storeName, AVG(r.rating) as overallRating 
      FROM stores s 
      JOIN ratings r ON s.id = r.store_id 
      GROUP BY s.id 
      ORDER BY overallRating DESC 
      LIMIT 3
    `);

    res.json({
      profile,
      stats: { totalStores, myRatings, pendingRatings },
      recentRatings,
      topStores
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getStores = async (req: any, res: Response) => {
  try {
    const [stores] = await pool.query(`
      SELECT s.*, 
        (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as averageRating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as myRating,
        (SELECT id FROM ratings WHERE store_id = s.id AND user_id = ?) as myRatingId
      FROM stores s
    `, [req.user.id, req.user.id]);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const submitRating = async (req: any, res: Response) => {
  try {
    const { storeId, rating } = req.body;
    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [req.user.id, storeId, rating]
    );
    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'You have already rated this store' });
    }
    res.status(400).json({ message: 'Server error', error });
  }
};

export const updateRating = async (req: any, res: Response) => {
  try {
    const { rating } = req.body;
    const { ratingId } = req.params;
    
    // Check if the rating belongs to the user
    const [result]: any = await pool.query(
      'UPDATE ratings SET rating = ? WHERE id = ? AND user_id = ?',
      [rating, ratingId, req.user.id]
    );
    
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Rating not found or unauthorized' });
    
    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Server error', error });
  }
};
