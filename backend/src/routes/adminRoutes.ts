import { Router } from 'express';
import { getDashboard, createUser, getUsers, getUserById, createStore, getStores } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate, authorize(['ADMIN'])); // All routes here require ADMIN

router.get('/dashboard', getDashboard);
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/stores', createStore);
router.get('/stores', getStores);

export default router;
