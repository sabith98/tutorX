import express from "express";
import { addComment, deleteComment } from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, addComment);
router.delete("/:id", protect, deleteComment);

export default router;
