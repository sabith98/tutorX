
import { Request, Response } from 'express';
import { PostModel } from '../models/Post';
import { z } from 'zod';


// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot be more than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description cannot be more than 500 characters'),
  videoUrl: z.string().url('Invalid video URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL'),
});

const updatePostSchema = z.object({
  title: z.string().max(100, 'Title cannot be more than 100 characters').optional(),
  description: z.string().max(500, 'Description cannot be more than 500 characters').optional(),
  videoUrl: z.string().url('Invalid video URL').optional(),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
});

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

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = createPostSchema.parse(req.body);
    
    const post = await PostModel.create({
      title: validatedData.title,
      description: validatedData.description,
      videoUrl: validatedData.videoUrl,
      thumbnailUrl: validatedData.thumbnailUrl,
      author: req.user.id,
    });
    
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = updatePostSchema.parse(req.body);
    
    let post = await PostModel.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Make sure user is post owner
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this post' });
    }
    
    post = await PostModel.findByIdAndUpdate(
      req.params.id,
      { ...validatedData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

