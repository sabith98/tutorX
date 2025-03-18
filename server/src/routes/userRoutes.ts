import express from "express";
import { getTutors, getUserById } from "../controllers/userController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/tutors", getTutors);
router.get("/:id", getUserById);

export default router;
