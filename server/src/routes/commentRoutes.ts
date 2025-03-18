import express from "express";
import { addComment } from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, addComment);

export default router;
