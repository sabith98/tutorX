import express from "express";
import {
    getTutorRatings,
  getTutors,
  getUserById,
  rateTutor,
  updateProfile,
} from "../controllers/userController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/tutors", getTutors);
router.get("/:id", getUserById);
router.put("/profile", protect, updateProfile);
router.post("/rate", protect, rateTutor);
router.get('/:id/ratings', getTutorRatings);

export default router;
