import Appointment from '../models/appointmentModel.js';
import Property from '../models/propertyModel.js';
import User from '../models/userModel.js';  // Assuming you have a User model for sellers/buyers

// Book an appointment for a property
export const bookAppointment = async (req, res) => {
  try {
    const { propertyId, slot } = req.body;
    const buyer = req.user.id; // Get the buyer's ID from the authenticated user

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Create a new appointment
    const appointment = await Appointment.create({
      property: propertyId,
      seller: property.user,  // The user selling the property
      buyer,
      slot,
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

// Get all appointments for a specific seller
export const getAppointmentsForSeller = async (req, res) => {
  try {
    const sellerId = req.user.id;  // Get the seller's ID from the authenticated user

    // Fetch appointments for this seller
    const appointments = await Appointment.find({ seller: sellerId })
      .populate('property buyer'); // Populate the property and buyer data

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get all appointments for a specific buyer
export const getAppointmentsForBuyer = async (req, res) => {
  try {
    const buyerId = req.user.id;  // Get the buyer's ID from the authenticated user

    // Fetch appointments for this buyer
    const appointments = await Appointment.find({ buyer: buyerId })
      .populate('property seller'); // Populate the property and seller data

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Update the appointment status (e.g., confirm or cancel an appointment)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    // Check if the status is valid
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Update the appointment status
    appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment status updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};
