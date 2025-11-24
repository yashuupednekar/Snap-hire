const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

// Get admin dashboard statistics
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({
      status: "Pending",
    });
    const totalPayments = await Payment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      totalPayments,
      totalRevenue: totalRevenue.length ? totalRevenue[0].totalAmount : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate(
      "userId",
      "name email contact"
    );
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Approve or Reject doctor
router.put("/doctor/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await Doctor.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Doctor status updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all appointments
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "specialization")
      .populate("patientId", "name email contact");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all payments
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("doctorId", "specialization")
      .populate("patientId", "name email");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
