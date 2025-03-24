import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  inquiry: { type: String, required: true },
  replies: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
