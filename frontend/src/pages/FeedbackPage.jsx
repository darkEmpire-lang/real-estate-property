import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    feedbackMsg: "",
    rating: 1, // Default to 1 star
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      tempErrors.name = "Name should contain only letters.";
    }
    if (formData.feedbackMsg.length < 10) {
      tempErrors.feedbackMsg = "Feedback must be at least 10 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Ensure token is stored on login
      const response = await axios.post(
        "http://localhost:4000/api/feedbacks/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setFormData({ name: "", feedbackMsg: "", rating: 1 });
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black">Share Your Feedback</h2>
        {message && <p className="text-center text-gray-700 mt-2">{message}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded-md mb-3"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <textarea
            name="feedbackMsg"
            placeholder="Write your feedback..."
            className="w-full p-3 border border-gray-300 rounded-md mb-3"
            rows="5"
            value={formData.feedbackMsg}
            onChange={handleChange}
            required
          />
          {errors.feedbackMsg && <p className="text-red-500 text-sm">{errors.feedbackMsg}</p>}

          <div className="mb-4">
            <label className="block text-gray-700">Rating:</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={formData.rating >= star ? "yellow" : "gray"}
                  viewBox="0 0 24 24"
                  width="30"
                  height="30"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="cursor-pointer"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {/* View My Feedbacks Button */}
        <button
          onClick={() => navigate("/my-feedbacks")}
          className="w-full bg-gray-800 text-white mt-3 py-2 rounded-md hover:bg-gray-900 transition text-center"
        >
          View My Feedbacks
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
