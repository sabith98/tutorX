
import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);

export default router;
