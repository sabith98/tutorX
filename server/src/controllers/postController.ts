
import { Request, Response } from 'express';
import { PostModel } from '../models/Post';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find()
      .populate('author', 'name avatarUrl isTutor hourlyRate rating totalRatings')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatarUrl isTutor',
        },
      })
      .sort('-createdAt');
    
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

