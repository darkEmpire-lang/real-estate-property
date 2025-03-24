import { useState } from "react";
import axios from "axios";

const TicketRaisePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // Ensure token is stored on login
      const response = await axios.post(
        "http://localhost:4000/api/tickets/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setFormData({ name: "", email: "", phone: "", inquiry: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black">
          Raise a Support Ticket
        </h2>
        {message && (
          <p className="text-center text-gray-700 mt-2">{message}</p>
        )}
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Your Phone"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="inquiry"
            placeholder="Describe your issue..."
            className="w-full p-2 border rounded-md mb-3"
            rows="4"
            value={formData.inquiry}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketRaisePage;
