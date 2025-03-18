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
