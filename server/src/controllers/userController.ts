import { Request, Response } from "express";
import { UserModel } from "../models/User";

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
