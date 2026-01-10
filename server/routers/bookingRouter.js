// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/BookingController.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/", createBooking);
bookingRoutes.get("/", getAllBookings);
bookingRoutes.get("/:id", getBookingById);
bookingRoutes.put("/:id", updateBooking);
bookingRoutes.delete("/:id", deleteBooking);

export default bookingRoutes;
