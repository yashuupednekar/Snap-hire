const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User"); // Import the User model
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");

const router = express.Router();

// Function to get Doctor ID from User ID
const getDoctorId = async (userId) => {
  try {
    const doctor = await Doctor.findOne({ userId });
    return doctor ? doctor._id : null;
  } catch (error) {
    console.error("❌ Error fetching Doctor ID:", error);
    return null;
  }
};

// ✅ Update Doctor's Availability
router.put("/availability", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Update Availability API Called");
    console.log("📩 Request Body:", req.body);

    const { availability } = req.body;
    const userId = req.user.id;
    console.log("🆔 Authenticated User ID:", userId);

    const doctorId = await getDoctorId(userId);
    if (!doctorId) {
      console.log("❌ No Doctor found for User:", userId);
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (!availability || !Array.isArray(availability)) {
      console.log("❌ Invalid availability data received");
      return res.status(400).json({ error: "Invalid availability data" });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { availability },
      { new: true, runValidators: true }
    );

    console.log("✅ Availability updated for Doctor:", doctorId);
    res.status(200).json({ message: "Availability updated", doctor });
  } catch (err) {
    console.error("❌ Error updating availability:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch Appointments for a Doctor
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Fetch Appointments API Called");

    const userId = req.user.id;
    console.log("🆔 Authenticated User ID:", userId);

    const doctorId = await getDoctorId(userId);
    if (!doctorId) {
      console.log("❌ No Doctor found for User:", userId);
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Extract query parameters
    const { period, startDate, endDate } = req.query;

    let appointments;

    if (period === "daily") {
      // Filter appointments for today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      appointments = await Appointment.find({
        doctorId,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).populate("patientId", "name email contact");
    } else if (period === "weekly") {
      // Filter appointments for the current week
      const startOfWeek = new Date();
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date();
      endOfWeek.setHours(23, 59, 59, 999);
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

      appointments = await Appointment.find({
        doctorId,
        date: { $gte: startOfWeek, $lte: endOfWeek },
      }).populate("patientId", "name email contact");
    } else if (period === "monthly") {
      // Filter appointments for the current month
      const startOfMonth = new Date();
      startOfMonth.setHours(0, 0, 0, 0);
      startOfMonth.setDate(1);
      const endOfMonth = new Date();
      endOfMonth.setHours(23, 59, 59, 999);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);

      appointments = await Appointment.find({
        doctorId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }).populate("patientId", "name email contact");
    } else if (startDate && endDate) {
      // Filter appointments for a custom date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      appointments = await Appointment.find({
        doctorId,
        date: { $gte: start, $lte: end },
      }).populate("patientId", "name email contact");
    } else {
      // If no period or date range is specified, return all appointments
      appointments = await Appointment.find({ doctorId }).populate(
        "patientId",
        "name email contact"
      );
    }

    console.log("📅 Appointments Found:", appointments.length);

    // Generate graph data
    const graphData = generateGraphData(appointments, period);

    res.status(200).json({ appointments, graphData });
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ error: err.message });
  }
});

// Function to generate graph data based on the provided JSON structure
function generateGraphData(appointments, period) {
  const data = {
    totalAppointments: appointments.length,
    completed: 0,
    cancelled: 0,
    pending: 0,
    revenue: 0, // Assuming each appointment has a fixed fee
    byTime: {}, // Group by time slot
    byStatus: {}, // Group by status
    byDate: {}, // Group by date
  };

  appointments.forEach((appointment) => {
    // Count completed, cancelled, and pending appointments
    if (appointment.status === "Completed") {
      data.completed++;
      data.revenue += 100; // Example: $100 per completed appointment
    } else if (appointment.status === "Cancelled") {
      data.cancelled++;
    } else if (appointment.status === "Pending") {
      data.pending++;
    }

    // Group by time slot
    const timeSlot = appointment.timeSlot;
    data.byTime[timeSlot] = (data.byTime[timeSlot] || 0) + 1;

    // Group by status
    const status = appointment.status;
    data.byStatus[status] = (data.byStatus[status] || 0) + 1;

    // Group by date
    const date = new Date(appointment.date).toLocaleDateString();
    data.byDate[date] = (data.byDate[date] || 0) + 1;
  });

  return data;
}

// ✅ Fetch Payments for a Doctor// ✅ Fetch Payments for a Doctor// ✅ Fetch Payments for a Doctor
router.get("/payments", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Fetch Payments API Called");

    const userId = req.user.id;
    console.log("🆔 Authenticated User ID:", userId);

    const doctorId = await getDoctorId(userId);
    if (!doctorId) {
      console.log("❌ No Doctor found for User:", userId);
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Extract query parameters
    const { period, startDate, endDate } = req.query;

    let payments;
    let start;
    let end = new Date();

    switch (period) {
      case "daily":
        // Filter payments for today
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case "weekly":
        // Filter payments for the current week
        start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - start.getDay());
        end.setHours(23, 59, 59, 999);
        end.setDate(end.getDate() + (6 - end.getDay()));
        break;

      case "monthly":
        // Filter payments for the current month
        start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(1);
        end.setHours(23, 59, 59, 999);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        break;

      case "custom":
        // Filter payments for a custom date range
        if (!startDate || !endDate) {
          return res.status(400).json({
            error: "Start date and end date are required for custom range",
          });
        }
        start = new Date(startDate);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        break;

      default:
        // If no period or date range is specified, return all payments
        start = null;
        end = null;
        break;
    }

    // Fetch payments based on the date range
    const query = { doctorId };
    if (start && end) {
      query.createdAt = { $gte: start, $lte: end };
    }

    payments = await Payment.find(query).populate("patientId", "name email");

    console.log("💰 Payments Found:", payments.length);

    // Generate graph data
    const graphData = generatePaymentGraphData(payments, period);

    res.status(200).json({ payments, graphData });
  } catch (err) {
    console.error("❌ Error fetching payments:", err);
    res.status(500).json({ error: err.message });
  }
});

// Function to generate graph data for payments
function generatePaymentGraphData(payments, period) {
  const data = {
    totalPayments: payments.length,
    totalEarnings: payments.reduce((sum, payment) => sum + payment.amount, 0),
    averageEarningsPerPayment:
      payments.length > 0
        ? payments.reduce((sum, payment) => sum + payment.amount, 0) /
          payments.length
        : 0,
    byDate: {}, // Group payments by date
    byPatient: {}, // Group payments by patient
    byStatus: {}, // Group payments by status (if applicable)
    byPaymentMethod: {}, // Group payments by payment method (if applicable)
  };

  payments.forEach((payment) => {
    // Group by date
    const date = new Date(payment.createdAt).toLocaleDateString();
    data.byDate[date] = (data.byDate[date] || 0) + payment.amount;

    // Group by patient
    const patientName = payment.patientId.name;
    data.byPatient[patientName] =
      (data.byPatient[patientName] || 0) + payment.amount;

    // Group by status (if applicable)
    if (payment.status) {
      data.byStatus[payment.status] =
        (data.byStatus[payment.status] || 0) + payment.amount;
    }

    // Group by payment method (if applicable)
    if (payment.paymentMethod) {
      data.byPaymentMethod[payment.paymentMethod] =
        (data.byPaymentMethod[payment.paymentMethod] || 0) + payment.amount;
    }
  });

  return data;
}

// ✅ Fetch Reviews for a Doctor
router.get("/reviews", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Fetch Reviews API Called");

    const userId = req.user.id;
    console.log("🆔 Authenticated User ID:", userId);

    const doctorId = await getDoctorId(userId);
    if (!doctorId) {
      console.log("❌ No Doctor found for User:", userId);
      return res.status(404).json({ error: "Doctor not found" });
    }

    const reviews = await Review.find({ doctorId }).populate(
      "patientId",
      "name email"
    );

    console.log("⭐ Reviews Found:", reviews.length);
    res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Appointment Status (Completed or Cancelled)
router.put("/appointments/:id/status", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Update Appointment Status API Called");

    const { id } = req.params; // Appointment ID
    const { status } = req.body; // New status: "Completed" or "Cancelled"
    const userId = req.user.id; // User ID from authMiddleware

    console.log("📩 Request Body:", req.body);
    console.log("🆔 Authenticated User ID:", userId);

    const doctorId = await getDoctorId(userId);
    if (!doctorId) {
      console.log("❌ No Doctor found for User:", userId);
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Validate the status
    if (!["Completed", "Cancelled"].includes(status)) {
      console.log("❌ Invalid status received:", status);
      return res.status(400).json({
        error: "Invalid status. Allowed values: 'Completed', 'Cancelled'",
      });
    }

    // Find the appointment by ID and doctorId
    const appointment = await Appointment.findOne({ _id: id, doctorId });

    if (!appointment) {
      console.log("❌ Appointment not found or unauthorized");
      return res
        .status(404)
        .json({ error: "Appointment not found or unauthorized" });
    }

    // Update the appointment status
    appointment.status = status;
    await appointment.save();

    // Get patient details
    const patient = await User.findById(appointment.patientId);
    if (!patient) {
      console.log("❌ Patient not found for Appointment:", id);
      return res.status(404).json({ error: "Patient not found" });
    }

    console.log("✅ Appointment status updated to:", status);

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: `Your Appointment Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <h2 style="text-align: center; color: #004D40;">Appointment Update</h2>
          <p>Dear <strong>${patient.name}</strong>,</p>
          <p>Your appointment with <strong>Dr. ${
            appointment.doctorId
          }</strong> has been updated.</p>

          <h3 style="color: #FF6F61;">Appointment Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Date:</strong></td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                appointment.date
              }</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Time Slot:</strong></td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                appointment.timeSlot
              }</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>New Status:</strong></td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px; color: ${
                status === "Completed" ? "green" : "red"
              };">
                <strong>${status}</strong>
              </td>
            </tr>
          </table>

          <p style="text-align: center; font-size: 14px; color: #555;">
            If you have any questions, please contact our support team.
          </p>
          <p style="text-align: center; font-size: 14px; color: #004D40;">
            Thank you for using our service!
          </p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email sending failed:", error);
      } else {
        console.log("✅ Confirmation email sent:", info.response);
      }
    });

    res.status(200).json({
      message: "Appointment status updated and email notification sent",
      appointment,
    });
  } catch (err) {
    console.error("❌ Error updating appointment status:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Generate Detailed Report with Review Metrics (Daily, Weekly, Monthly, Custom)
router.get("/report", authMiddleware, async (req, res) => {
  try {
    console.log("📊 Advanced Doctor Report API Called for Detailed Metrics");

    const userId = req.user.id;
    console.log("🆔 Authenticated User ID:", userId);

    const doctorId = await getDoctorId(userId);
    if (!doctorId) {
      console.log("❌ No Doctor found for User:", userId);
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Extract query parameters for time frame
    const { period, startDate, endDate } = req.query;

    // Validate the period
    if (!["daily", "weekly", "monthly", "custom"].includes(period)) {
      console.log("❌ Invalid period specified:", period);
      return res.status(400).json({
        error:
          "Invalid period. Allowed values: 'daily', 'weekly', 'monthly', 'custom'",
      });
    }

    // Define date ranges based on the period
    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "daily":
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setHours(0, 0, 0, 0)), // Start of today
            $lt: new Date(now.setHours(23, 59, 59, 999)), // End of today
          },
        };
        break;

      case "weekly":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
        const endOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 6)
        ); // End of the week (Saturday)
        dateFilter = {
          createdAt: {
            $gte: startOfWeek,
            $lt: endOfWeek,
          },
        };
        break;

      case "monthly":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the month
        dateFilter = {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        };
        break;

      case "custom":
        if (!startDate || !endDate) {
          console.log("❌ Missing startDate or endDate for custom period");
          return res.status(400).json({
            error: "startDate and endDate are required for custom period",
          });
        }
        dateFilter = {
          createdAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          },
        };
        break;

      default:
        console.log("❌ Invalid period specified:", period);
        return res.status(400).json({ error: "Invalid period" });
    }

    // Fetch appointments, payments, and reviews for the specified period
    const [appointments, payments, reviews] = await Promise.all([
      Appointment.find({ doctorId, ...dateFilter }).sort({ date: 1 }),
      Payment.find({ doctorId, ...dateFilter }).sort({ createdAt: 1 }),
      Review.find({ doctorId, ...dateFilter }).sort({ createdAt: 1 }),
    ]);

    // Aggregate appointment data
    const appointmentAggregatedData = appointments.reduce(
      (acc, appointment) => {
        const date = new Date(appointment.date).toISOString().split("T")[0]; // Format as YYYY-MM-DD

        if (!acc[date]) {
          acc[date] = {
            totalAppointments: 0,
            completedAppointments: 0,
            cancelledAppointments: 0,
          };
        }

        acc[date].totalAppointments += 1;

        if (appointment.status === "Completed") {
          acc[date].completedAppointments += 1;
        } else if (appointment.status === "Cancelled") {
          acc[date].cancelledAppointments += 1;
        }

        return acc;
      },
      {}
    );

    // Aggregate payment data
    const paymentAggregatedData = payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt).toISOString().split("T")[0]; // Format as YYYY-MM-DD

      if (!acc[date]) {
        acc[date] = {
          totalRevenue: 0,
          paymentMethods: {},
        };
      }

      acc[date].totalRevenue += payment.amount;

      // Track payment methods
      if (!acc[date].paymentMethods[payment.paymentMethod]) {
        acc[date].paymentMethods[payment.paymentMethod] = 0;
      }
      acc[date].paymentMethods[payment.paymentMethod] += 1;

      return acc;
    }, {});

    // Aggregate review data
    const reviewAggregatedData = reviews.reduce((acc, review) => {
      const date = new Date(review.createdAt).toISOString().split("T")[0]; // Format as YYYY-MM-DD

      if (!acc[date]) {
        acc[date] = {
          totalReviews: 0,
          totalRating: 0,
        };
      }

      acc[date].totalReviews += 1;
      acc[date].totalRating += review.rating;

      return acc;
    }, {});

    // Calculate total metrics
    const totalAppointments = appointments.length;
    const totalCompletedAppointments = appointments.filter(
      (appointment) => appointment.status === "Completed"
    ).length;
    const totalCancelledAppointments = appointments.filter(
      (appointment) => appointment.status === "Cancelled"
    ).length;
    const totalRevenue = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const averageRevenuePerAppointment =
      totalAppointments > 0 ? totalRevenue / totalAppointments : 0;

    // Payment method distribution
    const paymentMethodDistribution = payments.reduce((acc, payment) => {
      if (!acc[payment.paymentMethod]) {
        acc[payment.paymentMethod] = 0;
      }
      acc[payment.paymentMethod] += 1;
      return acc;
    }, {});

    // Patient-specific metrics
    const uniquePatients = [
      ...new Set(appointments.map((appointment) => appointment.patientId._id)),
    ];
    const patientAppointmentCount = appointments.reduce((acc, appointment) => {
      const patientId = appointment.patientId._id;
      if (!acc[patientId]) {
        acc[patientId] = {
          name: appointment.patientId.name,
          email: appointment.patientId.email,
          totalAppointments: 0,
          totalRevenue: 0,
        };
      }
      acc[patientId].totalAppointments += 1;
      acc[patientId].totalRevenue +=
        payments.find((payment) => payment.appointmentId === appointment._id)
          ?.amount || 0;
      return acc;
    }, {});

    // Top patients by revenue
    const topPatientsByRevenue = Object.values(patientAppointmentCount)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5); // Top 5 patients

    // Review metrics
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Format data for graphs
    const labels = Object.keys({
      ...appointmentAggregatedData,
      ...paymentAggregatedData,
      ...reviewAggregatedData,
    }); // Unique dates for X-axis
    const appointmentData = {
      total: labels.map(
        (date) => appointmentAggregatedData[date]?.totalAppointments || 0
      ),
      completed: labels.map(
        (date) => appointmentAggregatedData[date]?.completedAppointments || 0
      ),
      cancelled: labels.map(
        (date) => appointmentAggregatedData[date]?.cancelledAppointments || 0
      ),
    };
    const revenueData = labels.map(
      (date) => paymentAggregatedData[date]?.totalRevenue || 0
    );
    const paymentMethodsData = labels.map(
      (date) => paymentAggregatedData[date]?.paymentMethods || {}
    );
    const reviewData = {
      total: labels.map(
        (date) => reviewAggregatedData[date]?.totalReviews || 0
      ),
      averageRating: labels.map(
        (date) =>
          reviewAggregatedData[date]?.totalRating /
            reviewAggregatedData[date]?.totalReviews || 0
      ),
    };

    console.log("📊 Detailed Report Generated Successfully");
    res.status(200).json({
      doctorId,
      period,
      startDate: dateFilter.createdAt?.$gte || null,
      endDate: dateFilter.createdAt?.$lt || null,
      labels, // X-axis labels (dates)
      appointmentData, // Appointments data
      revenueData, // Revenue data
      paymentMethodsData, // Payment methods data
      reviewData, // Review data
      totalMetrics: {
        totalAppointments,
        totalCompletedAppointments,
        totalCancelledAppointments,
        totalRevenue,
        averageRevenuePerAppointment,
      },
      paymentMethodDistribution,
      patientMetrics: {
        uniquePatients: uniquePatients.length,
        topPatientsByRevenue,
      },
      reviewMetrics: {
        totalReviews,
        averageRating: averageRating.toFixed(2),
      },
    });
  } catch (err) {
    console.error("❌ Error generating detailed report:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
