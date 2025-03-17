
import express from 'express';
import {
  getPosts,
  getPostById,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

export default router;
