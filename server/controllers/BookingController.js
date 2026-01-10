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
      totalPrice,
      status,
    });


    // 6. Update room status
    existingRoom.status = "Booked";
    await existingRoom.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating booking",
      error: error.message,
    });
  }
};

/**
 * GET ALL BOOKINGS
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room", "roomNumber pricePerNight status");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

/**
 * GET BOOKING BY ID
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("room", "roomNumber pricePerNight");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

/**
 * UPDATE BOOKING
 */
export const updateBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, status } = req.body;

    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

        // Recalculate price if dates change
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkOut <= checkIn) {
        return res.status(400).json({
          message: "Invalid date range",
        });
      }

      const nights =
        (checkOut - checkIn) / (1000 * 60 * 60 * 24);
      booking.totalPrice = nights * booking.room.pricePerNight;
      booking.checkInDate = checkIn;
      booking.checkOutDate = checkOut;
    }

    if (status) booking.status = status;

    await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};


/**
 * DELETE BOOKING
 */
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
     // Free the room
    const room = await Room.findById(booking.room);
    if (room) {
      room.status = "Available";
      await room.save();
    }

    await booking.deleteOne();

    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};
