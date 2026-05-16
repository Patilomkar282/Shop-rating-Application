import { Router } from 'express';
import { getOwnerDashboard, getOwnerRatings } from '../controllers/ownerController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate, authorize(['STORE_OWNER', 'ADMIN'])); 

router.get('/dashboard', getOwnerDashboard);
router.get('/ratings', getOwnerRatings);

export default router;
