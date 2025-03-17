
import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

export default router;
