const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const middleware = require("../middleware/authMiddleware");

// API to generate doctor report
router.get("/doctor", middleware, async (req, res) => {
  const { type, startDate, endDate } = req.query;
  const doctorId = req.user._id; // Assuming middleware attaches `user` to `req`

  try {
    let report = {};

    // Total Appointments
    report.totalAppointments = await Appointment.countDocuments({ doctorId });

    // Total Earnings
    const totalEarnings = await Payment.aggregate([
      { $match: { doctorId, paymentStatus: "Success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    report.totalEarnings = totalEarnings[0]?.total || 0;

    // Reviews
    report.reviews = await Review.find({ doctorId }).populate(
      "patientId",
      "name"
    );

    // Date-wise, Weekly, Monthly, Lifetime Reports
    if (type === "weekly" || type === "monthly" || type === "custom") {
      const matchQuery = {
        doctorId,
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      };

      if (type === "weekly") {
        report.weeklyReport = await Payment.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: { $week: "$createdAt" },
              totalEarnings: { $sum: "$amount" },
              totalAppointments: { $sum: 1 },
            },
          },
        ]);
      } else if (type === "monthly") {
        report.monthlyReport = await Payment.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: { $month: "$createdAt" },
              totalEarnings: { $sum: "$amount" },
              totalAppointments: { $sum: 1 },
            },
          },
        ]);
      } else if (type === "custom") {
        report.customReport = await Payment.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              totalEarnings: { $sum: "$amount" },
              totalAppointments: { $sum: 1 },
            },
          },
        ]);
      }
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
