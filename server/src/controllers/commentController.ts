import { Request, Response } from "express";
import { z } from "zod";
import { CommentModel, IComment } from "../models/Comment";
import { PostModel } from "../models/Post";

// Validation schemas
const createCommentSchema = z.object({
  text: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment cannot be more than 500 characters"),
  postId: z.string(),
});

// @desc    Add comment to post
// @route   POST /api/comments
// @access  Private
export const addComment = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = createCommentSchema.parse(req.body);

    const post = await PostModel.findById(validatedData.postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = await CommentModel.create({
      text: validatedData.text,
      author: req.user.id,
      post: validatedData.postId,
    });

    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();

    // Populate author info for the response
    await comment.populate("author", "name avatarUrl isTutor");

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Make sure user is comment owner
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Remove comment from post's comments array
    await PostModel.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    // Delete the comment
    await comment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const comments = await CommentModel.find({ post: req.params.postId })
      .populate("author", "name avatarUrl isTutor")
      .sort("-createdAt");

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
