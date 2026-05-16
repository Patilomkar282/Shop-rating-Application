import { Router } from 'express';
import { signup, login, updatePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-password', authenticate, updatePassword);

export default router;
