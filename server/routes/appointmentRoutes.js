const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAppointmentDetails,
} = require("../controllers/appointmentController");

// Route to get appointment details
router.get("/details/:appointmentId", authMiddleware, getAppointmentDetails);

module.exports = router;
