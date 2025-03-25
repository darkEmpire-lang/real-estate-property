import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdStarBorder } from "react-icons/md"; // For star rating
import { FaUserCircle } from "react-icons/fa"; // For user icon

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch all feedbacks from backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/feedbacks/all");
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        setMessage("Error fetching feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <MdStar key={i} className="text-yellow-400" /> : <MdStarBorder key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">All User Feedbacks</h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-600 text-center">No feedbacks available.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-6 border rounded-lg shadow-xl bg-white hover:shadow-2xl transition-all"
            >
              <div className="flex items-center mb-4">
                <FaUserCircle className="text-blue-600 text-3xl mr-4" />
                <h3 className="text-xl font-semibold text-blue-600">{feedback.name}</h3>
              </div>

              <div className="mb-3">
                <p className="text-lg text-gray-800">{feedback.feedbackMsg}</p>
              </div>

              {/* Display Rating */}
              <div className="flex items-center mt-2">
                {renderStars(feedback.rating)}
              </div>

              {/* Display Date */}
              <p className="text-gray-500 text-sm mt-2">{new Date(feedback.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFeedbacks;
