const express = require("express");
const router = express.Router();
const { bookAppointment } = require("../controllers/bookingController");
const authenticate = require("../middleware/authMiddleware"); // Import middleware

// Booking Route
router.post("/book/:doctorId", authenticate, bookAppointment);

module.exports = router;
