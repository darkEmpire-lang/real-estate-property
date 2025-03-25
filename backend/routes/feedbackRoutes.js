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

router.post("/create", authUser, createFeedback);

router.get("/all", getAllFeedbacks);


router.get("/user", authUser, getUserFeedbacks);

router.put("/update/:feedbackId", authUser, updateFeedback);

router.delete("/delete/:feedbackId", authUser, deleteFeedback);

export default router;
