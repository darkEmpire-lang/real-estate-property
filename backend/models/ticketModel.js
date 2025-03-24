import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  inquiry: { type: String, required: true },
  reply: { type: String, default: "" },
  status: { type: String, enum: ["open", "closed"], default: "open" }
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
