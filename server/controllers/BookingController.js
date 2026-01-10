import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

export const createBooking = async (req, res) => {
  try {
    const { user, service, checkInDate, checkOutDate, status } = req.body;

    // Validate user
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate service
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // Create booking
    const booking = await Booking.create({
      user,
      service,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      status,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error occured in the Creating Booking",
      error: error.message,
    });
  }
};
