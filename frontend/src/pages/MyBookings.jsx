import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/bookings');
        setBookings(response.data.bookings);
      } catch (error) {
        toast.error("Error fetching bookings");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id} className="border-b py-4">
              <p className="text-lg font-semibold">{booking.propertyId.type}</p>
              <p>{booking.date}</p>
              <p>{booking.timeSlot}</p>
              <p className="text-xl font-semibold">${booking.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
