import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

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
        setTickets([]); // Ensure `tickets` is always an array
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    }

    // Polling to fetch tickets every 5 seconds to see new replies
    const interval = setInterval(() => {
      if (token) fetchTickets();
    }, 5000);

    return () => clearInterval(interval); // Cleanup polling on component unmount

  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Tickets</h2>

      {loading ? (
        <p className="text-gray-600">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-600">No tickets found.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="p-4 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{ticket.inquiry}</h3>
              <p className="text-sm text-gray-600">Status: {ticket.status}</p>
              <div className="mt-2">
                <p className="text-gray-700 font-medium">Replies:</p>
                {ticket.replies?.length > 0 ? (
                  ticket.replies.map((reply, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded mt-1">
                      <p className="text-sm">{reply.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reply.date).toLocaleString()}
                      </p>
                    </div>
                  ))
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
