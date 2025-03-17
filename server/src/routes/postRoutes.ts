
import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);

export default router;
