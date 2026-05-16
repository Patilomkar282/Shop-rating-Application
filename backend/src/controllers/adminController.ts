import type { Request, Response } from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [[usersResult], [storesResult], [ratingsResult]]: any = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM users'),
      pool.query('SELECT COUNT(*) as total FROM stores'),
      pool.query('SELECT COUNT(*) as total FROM ratings')
    ]);

    res.json({
      totalUsers: usersResult[0].total,
      totalStores: storesResult[0].total,
      totalRatings: ratingsResult[0].total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role || 'USER']
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Server error', error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, address, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const [users]: any = await pool.query('SELECT id, name, email, address, role, created_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const user = users[0];
    
    if (user.role === 'STORE_OWNER') {
      const [ratingResult]: any = await pool.query(`
        SELECT AVG(r.rating) as averageRating 
        FROM ratings r 
        JOIN stores s ON r.store_id = s.id 
        WHERE s.owner_id = ?
      `, [user.id]);
      user.storeRating = ratingResult[0].averageRating;
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const { name, email, address, owner_id } = req.body;
    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );
    res.status(201).json({ message: 'Store created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Server error', error });
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const [stores] = await pool.query(`
      SELECT s.id, s.name, s.email, s.address, u.name as ownerName, AVG(r.rating) as averageRating
      FROM stores s 
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
