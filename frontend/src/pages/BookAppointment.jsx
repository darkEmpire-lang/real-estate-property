import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [meetingType, setMeetingType] = useState("physical");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [price, setPrice] = useState(10);
  const [carNumber, setCarNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/properties/${id}`);
        setProperty(response.data.property);
        setAvailableSlots(["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM"]); // Example time slots
      } catch (error) {
        toast.error("Error fetching property details");
      }
    };
    fetchProperty();
  }, [id]);

  const handleMeetingChange = (e) => {
    setMeetingType(e.target.value);
    setPrice(e.target.value === "virtual" ? 30 : 10);
  };

  const validatePaymentDetails = () => {
    if (carNumber.length !== 12) {
      toast.error("Car number must be 12 digits.");
      return false;
    }
    if (cvv.length !== 3) {
      toast.error("CVV must be 3 digits.");
      return false;
    }
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    if (expiry <= currentDate) {
      toast.error("Expiry date must be a future date.");
      return false;
    }
    return true;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!validatePaymentDetails()) return;

    // Simulate payment success
    toast.success("Payment successful!");

    // Generate the receipt PDF
    const doc = new jsPDF();
    doc.text("Receipt for Appointment Booking", 20, 20);
    doc.text(`Name: ${name}`, 20, 30);
    doc.text(`Email: ${email}`, 20, 40);
    doc.text(`Contact: ${contact}`, 20, 50);
    doc.text(`Car Number: ${carNumber}`, 20, 60);
    doc.text(`Meeting Type: ${meetingType}`, 20, 70);
    doc.text(`Date: ${date}`, 20, 80);
    doc.text(`Time Slot: ${timeSlot}`, 20, 90);
    doc.text(`Total Price: $${price}`, 20, 100);
    doc.save("receipt.pdf");

    // Redirect to dashboard or other pages
    navigate("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      {property ? (
        <>
          <h2 className="text-3xl font-bold text-gray-800">{property.type}</h2>
          <img
            src={property.images[0]}
            alt="Property"
            className="w-full h-64 object-cover my-6 rounded-md shadow-md"
          />
          <p className="text-gray-600">{property.description}</p>
          <p className="text-gray-700 font-medium mt-2">Location: {property.location}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">${property.price}</p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Time Slot</h3>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="">Select a Time Slot</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Enter Booking Details</h3>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

            <label className="block text-gray-700 font-medium mt-4">Meeting Type:</label>
            <select
              value={meetingType}
              onChange={handleMeetingChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="physical">Physical Meeting ($10)</option>
              <option value="virtual">Virtual Meeting ($30)</option>
            </select>

            <label className="block text-gray-700 font-medium mt-4">Select Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              min={new Date().toISOString().split("T")[0]}
            />

            {/* Payment Details Form */}
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Payment Details</h3>
            <input
              type="text"
              placeholder="Car Number (12 digits)"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <input
              type="text"
              placeholder="CVV (3 digits)"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <input
              type="month"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <p className="text-xl font-semibold text-gray-900 mt-4">Total Price: ${price}</p>

          <button
            onClick={handlePayment}
            className="w-full bg-black text-white py-3 rounded-md shadow-md font-semibold hover:bg-blue-700 transition duration-300 mt-6"
          >
            Proceed to Payment
          </button>
        </>
      ) : (
        <p className="text-gray-600 text-center">Loading property details...</p>
      )}
    </div>
  );
};

export default BookAppointment;
