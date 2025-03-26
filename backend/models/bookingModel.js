import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  meetingType: { type: String, enum: ["physical", "virtual"], required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  paymentStatus: { type: String, default: "Pending" },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
