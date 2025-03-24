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
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      tempErrors.name = "Name should contain only letters.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (formData.inquiry.length < 10) {
      tempErrors.inquiry = "Inquiry must be at least 10 characters.";
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
        "http://localhost:4000/api/tickets/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setFormData({ name: "", email: "", phone: "", inquiry: "" });
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
            className="w-full p-2 border rounded-md mb-1"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-2 border rounded-md mb-1"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="phone"
            placeholder="Your Phone"
            className="w-full p-2 border rounded-md mb-1"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <textarea
            name="inquiry"
            placeholder="Describe your issue..."
            className="w-full p-2 border rounded-md mb-1"
            rows="4"
            value={formData.inquiry}
            onChange={handleChange}
            required
          />
          {errors.inquiry && <p className="text-red-500 text-sm">{errors.inquiry}</p>}

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
