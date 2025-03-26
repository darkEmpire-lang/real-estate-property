import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [replyData, setReplyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [chartVisible, setChartVisible] = useState(false);
  const [ticketStats, setTicketStats] = useState({});

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
      generateTicketStats(response.data.tickets);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch tickets");
    }
  };

  const generateTicketStats = (tickets) => {
    const stats = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      
      stats[dateString] = tickets.filter((ticket) => 
        ticket.createdAt && ticket.createdAt.startsWith(dateString)
      ).length;
    }

    setTicketStats(stats);
  };

  const exportReport = () => {
    const doc = new jsPDF();
    doc.text("Ticket Report - Past Week", 14, 10);
    const tableColumn = ["Date", "Ticket Count"];
    const tableRows = Object.entries(ticketStats).map(([date, count]) => [date, count]);
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("ticket_report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-black">Admin Ticket Management</h2>
        {message && <p className="text-center text-gray-700 mt-2">{message}</p>}

        {/* Buttons for Chart & Report */}
        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={() => setChartVisible(!chartVisible)}
          >
            {chartVisible ? "Hide Chart" : "View Chart"}
          </button>
          <button
            className="bg-green-600 text-white py-2 px-4 rounded-md"
            onClick={exportReport}
          >
            Export Report
          </button>
        </div>

        {/* Chart Section */}
        {chartVisible && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-center">Tickets Over the Past Week</h3>
            <div className="mt-4">
              <Bar
                data={{
                  labels: Object.keys(ticketStats),
                  datasets: [
                    {
                      label: "Tickets Received",
                      data: Object.values(ticketStats),
                      backgroundColor: "#4A90E2",
                      borderColor: "#003366",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTicketsPage;
