import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdStar, MdStarBorder } from "react-icons/md";
import Swal from "sweetalert2";

const MyFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [message, setMessage] = useState("");

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

  const deleteFeedback = async (feedbackId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:4000/api/feedbacks/delete/${feedbackId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackId));
          Swal.fire("Deleted!", "Your feedback has been deleted.", "success");
        } catch (error) {
          setMessage("Error deleting feedback");
        }
      }
    });
  };

  const editFeedback = (feedbackId, currentMessage) => {
    setEditFeedbackId(feedbackId);
    setEditedMessage(currentMessage);
  };

  const updateFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/feedbacks/update/${editFeedbackId}`,
        { feedbackMsg: editedMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback._id === editFeedbackId
            ? { ...feedback, feedbackMsg: response.data.feedback.feedbackMsg }
            : feedback
        )
      );
      setEditFeedbackId(null);
      setEditedMessage("");
      Swal.fire("Updated!", "Your feedback has been updated successfully.", "success");
    } catch (error) {
      console.error("Error updating feedback:", error.response?.data || error.message);
      setMessage("Error updating feedback");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? <MdStar key={i} className="text-yellow-400" /> : <MdStarBorder key={i} className="text-yellow-400" />
    );
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
            <div key={feedback._id} className="p-6 border rounded-lg shadow-xl bg-white hover:shadow-2xl transition-all">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-blue-600">{feedback.feedbackMsg}</h3>
                <div className="flex space-x-4 text-gray-500">
                  <FaEdit className="cursor-pointer hover:text-blue-500" title="Edit Feedback" onClick={() => editFeedback(feedback._id, feedback.feedbackMsg)} />
                  <FaTrash className="cursor-pointer hover:text-red-500" title="Delete Feedback" onClick={() => deleteFeedback(feedback._id)} />
                </div>
              </div>

              <div className="flex items-center mt-2">{renderStars(feedback.rating)}</div>
              <p className="text-gray-500 text-sm mt-1">{new Date(feedback.createdAt).toLocaleString()}</p>

              {editFeedbackId === feedback._id && (
                <div className="mt-4">
                  <textarea className="w-full p-3 border rounded-md" value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} placeholder="Edit your feedback here..." />
                  <button className="mt-3 bg-blue-500 text-white p-3 rounded-md" onClick={updateFeedback}>Update Feedback</button>
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
