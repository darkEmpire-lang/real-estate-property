import express from "express";
import { createTicket, getAllTickets, getUserTickets, replyTicket } from "../controllers/ticketController.js";
import authUser from "../middleware/auth.js";
import adminAuth from  "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", authUser, createTicket);
router.get("/all", getAllTickets);
router.get("/user", authUser, getUserTickets);
router.post("/reply",replyTicket);

export default router;
