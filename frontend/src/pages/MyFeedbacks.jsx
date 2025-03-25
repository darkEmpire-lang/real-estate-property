import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdStar, MdStarBorder } from "react-icons/md"; // For star rating

const MyFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [message, setMessage] = useState("");

  // Fetch feedbacks for the logged-in user
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/feedbacks/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        setMessage("Error fetching feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Handle delete feedback
  const deleteFeedback = async (feedbackId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/feedbacks/delete/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackId));
    } catch (error) {
      setMessage("Error deleting feedback");
    }
  };

  // Handle edit feedback
  const editFeedback = (feedbackId, currentMessage) => {
    setEditFeedbackId(feedbackId);
    setEditedMessage(currentMessage);
  };

  // Handle update feedback
  const updateFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/feedbacks/update/${editFeedbackId}`,
        { feedback: editedMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback._id === editFeedbackId ? { ...feedback, feedback: response.data.feedback.feedback } : feedback
        )
      );
      setEditFeedbackId(null);
      setEditedMessage("");
    } catch (error) {
      setMessage("Error updating feedback");
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <MdStar key={i} className="text-yellow-400" /> : <MdStarBorder key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">My Feedbacks</h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-600 text-center">No feedbacks found.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-6 border rounded-lg shadow-xl bg-white hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-blue-600">{feedback.feedbackMsg}</h3>
                <div className="flex space-x-4 text-gray-500">
                  <FaEdit
                    className="cursor-pointer hover:text-blue-500"
                    title="Edit Feedback"
                    onClick={() => editFeedback(feedback._id, feedback.feedbackMsg)}
                  />
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    title="Delete Feedback"
                    onClick={() => deleteFeedback(feedback._id)}
                  />
                </div>
              </div>

              {/* Display Rating */}
              <div className="flex items-center mt-2">
                {renderStars(feedback.rating)}
              </div>

              {/* Display Date */}
              <p className="text-gray-500 text-sm mt-1">{new Date(feedback.createdAt).toLocaleString()}</p>

              {/* Edit Feedback Section */}
              {editFeedbackId === feedback._id && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-3 border rounded-md"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    placeholder="Edit your feedback here..."
                  />
                  <button
                    className="mt-3 bg-blue-500 text-white p-3 rounded-md"
                    onClick={updateFeedback}
                  >
                    Update Feedback
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFeedbacks;
