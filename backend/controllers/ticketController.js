import Ticket from "../models/ticketModel.js";

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { userId, name, email, phone, inquiry } = req.body;

    const ticket = new Ticket({ userId, name, email, phone, inquiry });
    await ticket.save();

    res.status(201).json({ success: true, message: "Ticket Raised Successfully", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tickets for admin
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("userId", "name email");
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tickets for a specific user
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.body.userId;
    const tickets = await Ticket.find({ userId });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin reply to a ticket
export const replyTicket = async (req, res) => {
  try {
    const { ticketId, reply } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket Not Found" });

    
    ticket.replies.push({ message: reply });
    await ticket.save();


    res.status(200).json({ success: true, message: "Reply Sent", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
