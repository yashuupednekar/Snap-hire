const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware
const upload = require("../middleware/upload"); // Import multer middleware
const path = require("path");

// GET Patient Profile & Appointments (Protected Route)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const patientId = req.user.id; // Extracted from token in middleware

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "Patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name")
      .sort({ date: 1 });

    const formattedAppointments = appointments.map((appointment) => ({
      _id: appointment._id,
      doctorName: appointment.doctorId.name,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      status: appointment.status,
    }));

    res.json({ patient, appointments: formattedAppointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST Cancel Appointment (Protected Route)
router.delete(
  "/appointment/cancel/:appointmentId",
  authMiddleware,
  async (req, res) => {
    try {
      const appointmentId = req.params.appointmentId;
      const patientId = req.user.id; // Ensure the appointment belongs to the logged-in patient

      const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId, patientId },
        { status: "Cancelled" },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json({ message: "Appointment cancelled successfully", appointment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put("/profile", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const patientId = req.user.id;
    const { name, email, contact } = req.body;

    // Check if a file was uploaded and extract only the filename
    const profileImage = req.file ? path.basename(req.file.path) : undefined;

    // Prepare the update object
    const updateData = { name, email, contact };
    if (profileImage) {
      updateData.profileImage = profileImage; // Store only the image name
    }

    // Update the patient profile
    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      message: "Profile updated successfully",
      patient: updatedPatient,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
