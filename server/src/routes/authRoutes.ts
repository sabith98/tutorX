import express from 'express';
import { register, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.get('/me', protect, getMe);


export default router;