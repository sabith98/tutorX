import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../models/User";
import config from "../config/configuration";

// Generate JWT
const generateToken = (id: string): string => {
  const payload = {
    data: {
      userId: id,
      type: "access",
    },
  };

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "30d",
    issuer: "tutorX-api",
    audience: "tutorX-client",
  };

  return jwt.sign(payload, config.jwt.secret, options);
};

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isTutor: z.boolean(),
  hourlyRate: z.number().optional(),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const userExists = await UserModel.findOne({ email: validatedData.email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create user
    const user = await UserModel.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      isTutor: validatedData.isTutor,
      hourlyRate: validatedData.isTutor ? validatedData.hourlyRate : undefined,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isTutor: user.isTutor,
          hourlyRate: user.hourlyRate,
          followers: user.followers,
          following: user.following,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
        },
        token: generateToken(user._id.toString()),
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isTutor: user.isTutor,
        hourlyRate: user.hourlyRate,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        totalRatings: user.totalRatings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
