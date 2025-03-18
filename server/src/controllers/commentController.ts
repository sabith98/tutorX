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
