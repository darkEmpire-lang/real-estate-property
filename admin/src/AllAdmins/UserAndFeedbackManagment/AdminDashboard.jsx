import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdStarBorder, MdDelete } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/feedbacks/delete/${id}`);
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
    } catch (error) {
      setMessage("Error deleting feedback");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? <MdStar key={i} className="text-yellow-400" /> : <MdStarBorder key={i} className="text-yellow-400" />
    );
  };

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (rate) => feedbacks.filter((feedback) => feedback.rating === rate).length
  );

  const barChartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Feedback Ratings",
        data: ratingCounts,
        backgroundColor: ["#FF0000", "#FFA500", "#FFFF00", "#90EE90", "#008000"],
        borderColor: "#000000",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-6">Feedback Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-white shadow-lg rounded-lg text-center">
          <h3 className="text-xl font-semibold">Total Feedbacks</h3>
          <p className="text-3xl font-bold text-blue-700">{feedbacks.length}</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold text-center">Feedback Rating Analysis</h3>
          <Bar data={barChartData} />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-600 text-center">No feedbacks available.</p>
      ) : (
        <div className="space-y-6">
          {(showAll ? feedbacks : feedbacks.slice(0, 5)).map((feedback) => (
            <div
              key={feedback._id}
              className="p-6 border rounded-lg shadow-xl bg-white hover:shadow-2xl transition-all relative"
            >
              <div className="flex items-center mb-4">
                <FaUserCircle className="text-blue-600 text-3xl mr-4" />
                <h3 className="text-xl font-semibold text-blue-600">{feedback.name}</h3>
              </div>
              <p className="text-lg text-gray-800">{feedback.feedbackMsg}</p>
              <div className="flex items-center mt-2">{renderStars(feedback.rating)}</div>
              <p className="text-gray-500 text-sm mt-2">{new Date(feedback.createdAt).toLocaleString()}</p>
              <button
                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                onClick={() => handleDelete(feedback._id)}
              >
                <MdDelete size={24} />
              </button>
            </div>
          ))}
        </div>
      )}

      {feedbacks.length > 5 && (
        <button
          className="mt-6 w-full py-2 bg-black text-white rounded-lg hover:bg-blue-700"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View More"}
        </button>
      )}
    </div>
  );
};

export default AdminDashboard;
