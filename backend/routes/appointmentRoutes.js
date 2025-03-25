import express from 'express';
import { bookAppointment, getAppointmentsForSeller, getAppointmentsForBuyer, updateAppointmentStatus } from '../controllers/appointmentController.js';
import authUser from '../middleware/auth.js'; // Middleware for authentication

const router = express.Router();

// Route to book an appointment for a property
router.post('/book',authUser, bookAppointment);  // protect middleware ensures user is logged in

// Route to get all appointments for the logged-in seller
router.get('/seller/appointments',authUser, getAppointmentsForSeller);

// Route to get all appointments for the logged-in buyer
router.get('/buyer/appointments',authUser, getAppointmentsForBuyer);

// Route to update the status of an appointment (e.g., confirm/cancel)
router.put('/status',authUser, updateAppointmentStatus);

export default router;
