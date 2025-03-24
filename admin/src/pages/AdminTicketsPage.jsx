import { useState, useEffect } from "react";
import axios from "axios";

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [replyData, setReplyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/tickets/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data.tickets);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch tickets");
    }
  };

  const handleReplyChange = (ticketId, value) => {
    setReplyData((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleReplySubmit = async (ticketId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tickets/reply",
        { ticketId, reply: replyData[ticketId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Reply sent successfully");
      fetchTickets(); // Refresh tickets
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Admin Ticket Management
        </h2>
        {message && (
          <p className="text-center text-gray-700 mt-2">{message}</p>
        )}
        <div className="mt-4">
          {tickets.length === 0 ? (
            <p className="text-center text-gray-600">No tickets available</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket._id} className="border-b py-4">
                <p className="font-semibold">{ticket.name}</p>
                <p className="text-gray-700">{ticket.email}</p>
                <p className="text-gray-600">{ticket.inquiry}</p>
                <p className="text-green-600">{ticket.reply || "No reply yet"}</p>
                <textarea
                  className="w-full p-2 border rounded-md mt-2"
                  rows="2"
                  placeholder="Write a reply..."
                  value={replyData[ticket._id] || ""}
                  onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
                />
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-md mt-2 hover:bg-blue-700 transition"
                  onClick={() => handleReplySubmit(ticket._id)}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reply"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
