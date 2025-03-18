import express from "express";
import {
  addComment,
  deleteComment,
  getCommentsByPost,
} from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, addComment);
router.delete("/:id", protect, deleteComment);
router.get("/post/:postId", getCommentsByPost);

export default router;
