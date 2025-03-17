
import express from 'express';
import {
  getPosts,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getPosts);

export default router;
