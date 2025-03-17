
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

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate('author', 'name avatarUrl isTutor hourlyRate rating totalRatings')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatarUrl isTutor',
        },
      });
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

