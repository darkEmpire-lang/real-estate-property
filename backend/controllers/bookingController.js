import Booking from "../models/bookingModel.js";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51R6fkFQ2epDOtxLUiX9gI9WLCFFkl2h6LHEvflB9NG8eE9Y6a3hS06Ue7j1KiLR4UXhLsLVP9tU8tD2WKl5d4DJh00OuuSgF5W");

export const createBooking = async (req, res) => {
  const { propertyId, name, email, contact, meetingType, date, price, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount: price * 100,
      currency: "USD",
      source: token.id,
      description: `Booking for ${name}`,
    });

    if (!charge) return res.status(500).send("Payment failed");

    const newBooking = new Booking({
      propertyId,
      name,
      email,
      contact,
      meetingType,
      date,
      price,
      paymentStatus: "Paid",
    });

    await newBooking.save();
    res.status(201).json({ success: true, message: "Booking successful", bookingId: newBooking._id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment error", error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("propertyId");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings" });
  }
};
