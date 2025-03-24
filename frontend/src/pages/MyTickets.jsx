import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const MyTickets = () => {
  const { token } = useContext(ShopContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/tickets/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User Tickets Response:", response.data);
        setTickets(Array.isArray(response.data.tickets) ? response.data.tickets : []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    }

    const interval = setInterval(() => {
      if (token) fetchTickets();
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Tickets</h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-600 text-center">No tickets found.</p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="p-5 border rounded-lg shadow-lg bg-white">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-blue-600">{ticket.inquiry}</h3>
                <div className="flex space-x-3 text-gray-500">
                  <FaEdit className="cursor-pointer hover:text-blue-500" title="Edit Ticket" />
                  <FaTrash className="cursor-pointer hover:text-red-500" title="Delete Ticket" />
                </div>
              </div>
              <p className="text-sm text-gray-700">Status: <span className="font-semibold text-green-600">{ticket.status}</span></p>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">Replies:</p>
                {ticket.replies?.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {ticket.replies.map((reply, index) => (
                      <div key={index} className="bg-gray-100 p-3 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-gray-800">{reply.message}</p>
                        <p className="text-xs text-gray-500">{new Date(reply.date).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No replies yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
