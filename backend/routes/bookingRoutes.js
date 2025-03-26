import express from "express";
import { createBooking, getBookings } from "../controllers/bookingController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/",authUser, createBooking);
router.get("/",authUser, getBookings);

export default router;
