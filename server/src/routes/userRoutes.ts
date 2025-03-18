import express from "express";
import { getTutors } from "../controllers/userController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/tutors", getTutors);

export default router;
