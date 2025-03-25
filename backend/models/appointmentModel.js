import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  slot: String,
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Appointment", appointmentSchema);
