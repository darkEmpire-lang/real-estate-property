import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  getUserFeedbacks,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

// ✅ Create Feedback (User Only)
router.post("/create", authUser, createFeedback);

// ✅ Get All Feedbacks (Admin Only)
router.get("/all", getAllFeedbacks);

// ✅ Get Feedbacks for Logged-in User
router.get("/user", authUser, getUserFeedbacks);

// ✅ Update Feedback (User Only)
router.put("/update/:feedbackId", authUser, updateFeedback);

// ✅ Delete Feedback (User or Admin)
router.delete("/delete/:feedbackId", authUser, deleteFeedback);

export default router;
