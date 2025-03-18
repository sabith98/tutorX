import { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../models/User";

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  hourlyRate: z.number().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

// @desc    Get all tutors
// @route   GET /api/users/tutors
// @access  Public
export const getTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await UserModel.find({ isTutor: true }).select("-password");
    res.status(200).json({ success: true, data: tutors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (validatedData.name) user.name = validatedData.name;
    if (validatedData.hourlyRate && user.isTutor)
      user.hourlyRate = validatedData.hourlyRate;
    if (validatedData.bio) user.bio = validatedData.bio;
    if (validatedData.avatarUrl) user.avatarUrl = validatedData.avatarUrl;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isTutor: updatedUser.isTutor,
        hourlyRate: updatedUser.hourlyRate,
        followers: updatedUser.followers,
        following: updatedUser.following,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
        rating: updatedUser.rating,
        totalRatings: updatedUser.totalRatings,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
