import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(16).regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/),
  address: z.string().max(400).optional(),
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']).optional().default('USER')
});

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedData = signupSchema.parse(req.body);
    
    // Check if user exists
    const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE email = ?', [parsedData.email]);
    if (existingUsers.length > 0) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [parsedData.name, parsedData.email, hashedPassword, parsedData.address, parsedData.role]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Validation or server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });
    
    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePassword = async (req: any, res: Response) => {
  try {
    const { newPassword } = req.body;
    
    const passwordSchema = z.string().min(8).max(16).regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/);
    passwordSchema.parse(newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Validation or server error', error });
  }
};
