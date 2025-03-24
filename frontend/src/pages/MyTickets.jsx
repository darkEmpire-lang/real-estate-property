import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const MyTickets = () => {
  const { token } = useContext(ShopContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTicketId, setEditTicketId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/tickets/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedTickets = response.data.tickets.map((ticket) => {
          return { ...ticket, status: ticket.replies && ticket.replies.length > 0 ? "Resolved" : "Pending" };
        });

        setTickets(updatedTickets);
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

  // Handle delete ticket
  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:4000/api/tickets/delete/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  // Handle edit ticket
  const editTicket = (ticketId, currentMessage) => {
    setEditTicketId(ticketId);
    setEditedMessage(currentMessage);
  };

  // Handle update ticket
  const updateTicket = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/tickets/update/${editTicketId}`,
        { inquiry: editedMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === editTicketId
          ? { ...ticket, inquiry: response.data.ticket.inquiry }
          : ticket
      );
      setTickets(updatedTickets);
      setEditTicketId(null);
      setEditedMessage("");
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

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
                  <FaEdit
                    className="cursor-pointer hover:text-blue-500"
                    title="Edit Ticket"
                    onClick={() => editTicket(ticket._id, ticket.inquiry)}
                  />
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    title="Delete Ticket"
                    onClick={() => deleteTicket(ticket._id)}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Status: <span className={`font-semibold ${ticket.status === "Resolved" ? "text-green-600" : "text-yellow-500"}`}>{ticket.status}</span>
              </p>
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

              {editTicketId === ticket._id && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                  />
                  <button
                    className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                    onClick={updateTicket}
                  >
                    Update Ticket
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

export default MyTickets;
