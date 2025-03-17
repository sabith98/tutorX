import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import config from "../config/configuration";

interface JwtPayload {
  data: {
    userId: string;
    type: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      // const decoded = jwt.verify(token, config.jwt.secret) as {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as JwtPayload;
      // Get user from the token
      req.user = await UserModel.findById(decoded.data.userId).select(
        "-password"
      );

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

export const isTutor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isTutor) {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Not authorized as tutor" });
  }
};
