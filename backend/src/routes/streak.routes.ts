import { Router } from 'express';
import { setupStreak, dailyCheckin, getStreak, getStreakStats } from '../controllers/streak.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/setup', setupStreak);
router.post('/checkin', dailyCheckin);
router.get('/', getStreak);
router.get('/stats', getStreakStats);

export default router;
