import { Router } from 'express';
import { getStores, submitRating, updateRating, getUserDashboard } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate, authorize(['ADMIN', 'USER', 'STORE_OWNER'])); 

router.get('/dashboard', getUserDashboard);
router.get('/stores', getStores);
router.post('/ratings', submitRating);
router.put('/ratings/:ratingId', updateRating);

export default router;
