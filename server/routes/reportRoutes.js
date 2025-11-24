const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment"); // Adjust the path as needed
const Payment = require("../models/Payment"); // Adjust the path as needed
const Review = require("../models/Review"); // Adjust the path as needed

const router = express.Router();

// Helper function to group data by date, month, and week
const groupData = (data, startDate, endDate) => {
  return data.reduce((acc, item) => {
    const date = new Date(item.createdAt);

    // Check if the date falls within the specified range
    if (date < startDate || date > endDate) return acc;

    const dateKey = date.toISOString().split("T")[0]; // Date in YYYY-MM-DD format
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // Month in YYYY-MM format
    const weekKey = `${date.getFullYear()}-${getWeekNumber(date)}`; // Week in YYYY-WW format

    // Date-wise distribution
    if (!acc.dateWise) acc.dateWise = {};
    acc.dateWise[dateKey] = (acc.dateWise[dateKey] || 0) + 1;

    // Month-wise distribution
    if (!acc.monthWise) acc.monthWise = {};
    acc.monthWise[monthKey] = (acc.monthWise[monthKey] || 0) + 1;

    // Week-wise distribution
    if (!acc.weekWise) acc.weekWise = {};
    acc.weekWise[weekKey] = (acc.weekWise[weekKey] || 0) + 1;

    return acc;
  }, {});
};

// Helper function to get the week number of a date
const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

// Helper function to get the start and end of the current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
};

// API to generate the report dynamically
router.get("/", async (req, res) => {
  try {
    // Extract query parameters for date range
    const { startDate, endDate } = req.query;

    let start, end;

    // If no date range is provided, fetch all data (lifetime report)
    if (!startDate || !endDate) {
      start = null;
      end = null;
    } else {
      // Validate the provided date range
      start = new Date(startDate);
      end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Please use YYYY-MM-DD.",
        });
      }
    }

    // Fetch all appointments, payments, and reviews
    const appointments = await Appointment.find(
      start && end ? { createdAt: { $gte: start, $lte: end } } : {} // Fetch all if no date range is provided
    );
    const payments = await Payment.find(
      start && end ? { createdAt: { $gte: start, $lte: end } } : {} // Fetch all if no date range is provided
    );
    const reviews = await Review.find(
      start && end ? { createdAt: { $gte: start, $lte: end } } : {} // Fetch all if no date range is provided
    );

    // Generate reports for appointments, payments, and reviews
    const appointmentReport = groupData(appointments, start, end);
    const paymentReport = groupData(payments, start, end);
    const reviewReport = groupData(reviews, start, end);

    // Send the response
    res.status(200).json({
      success: true,
      reportSummary: {
        totalAppointments: appointments.length,
        totalPayments: payments.length,
        totalReviews: reviews.length,
      },
      detailedReport: {
        appointments: appointmentReport,
        payments: paymentReport,
        reviews: reviewReport,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
