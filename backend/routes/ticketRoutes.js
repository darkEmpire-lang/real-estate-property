import express from "express";
import { createTicket, getAllTickets, getUserTickets, replyTicket,deleteTicket,updateTicket } from "../controllers/ticketController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/create", authUser, createTicket);
router.get("/all", getAllTickets); // Protect route
router.get("/user", authUser, getUserTickets);
router.post("/reply", replyTicket); // Protect reply route
router.delete("/delete/:ticketId", authUser, deleteTicket);
router.put("/update/:ticketId", authUser, updateTicket);


export default router;
