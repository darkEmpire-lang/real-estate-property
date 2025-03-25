import Feedback from "../models/feedbackModel.js";

// ✅ Create a new feedback
export const createFeedback = async (req, res) => {
  try {
    const { userId, name, feedbackMsg, rating } = req.body;

    if (!userId || !name || !feedbackMsg || !rating) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const feedback = new Feedback({ userId, name, feedbackMsg, rating });
    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all feedbacks (Admin Only)
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "name email");
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get feedbacks for a specific user
export const getUserFeedbacks = async (req, res) => {
  try {
    const { userId } = req.body;
    const feedbacks = await Feedback.find({ userId });
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { feedbackMsg, rating } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback Not Found" });

    if (feedbackMsg) feedback.feedbackMsg = feedbackMsg;
    if (rating !== undefined) feedback.rating = rating; // ✅ Only update if rating is provided

    await feedback.save();

    res.status(200).json({ success: true, message: "Feedback updated successfully", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Delete Feedback (User or Admin)
export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findByIdAndUpdate(feedbackId);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback Not Found" });


    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
