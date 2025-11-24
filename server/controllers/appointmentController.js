const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Payment = require("../models/Payment");

// exports.getAppointmentDetails = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;

//     // Disable caching to always get fresh data
//     res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     const appointment = await Appointment.findById(appointmentId)
//       .populate("doctorId", "name specialization experience feesPerSession")
//       .populate("patientId", "name email contact")
//       .exec();

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     // Fetch payment details
//     const payment = await Payment.findOne({ appointmentId });

//     res.status(200).json({
//       doctor: {
//         name: appointment.doctorId.name,
//         specialization: appointment.doctorId.specialization,
//         experience: appointment.doctorId.experience,
//         fees: appointment.doctorId.feesPerSession,
//       },
//       patient: {
//         name: appointment.patientId.name,
//         email: appointment.patientId.email,
//         contact: appointment.patientId.contact,
//       },
//       appointment: {
//         date: appointment.date,
//         timeSlot: appointment.timeSlot,
//         status: appointment.status,
//       },
//       payment: payment
//         ? {
//             amount: payment.amount,
//             transactionId: payment.transactionId,
//             paymentStatus: payment.paymentStatus,
//           }
//         : { message: "Payment details not available" },
//       timestamp: new Date().toISOString(), // Ensure unique response
//     });
//   } catch (error) {
//     console.error("Error fetching appointment details:", error);
//     res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };


exports.getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Disable caching to always get fresh data
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Fetch appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email contact" }, // Get Doctor's User details
      })
      .populate("patientId", "name email contact") // Get Patient details
      .exec();

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.doctorId || !appointment.doctorId.userId) {
      return res.status(404).json({ message: "Doctor details not found" });
    }

    // Fetch payment details
    const payment = await Payment.findOne({ appointmentId });

    res.status(200).json({
      doctor: {
        name: appointment.doctorId.userId.name,
        email: appointment.doctorId.userId.email,
        contact: appointment.doctorId.userId.contact,
        specialization: appointment.doctorId.specialization,
        experience: appointment.doctorId.experience,
        fees: appointment.doctorId.feesPerSession,
      },
      patient: {
        name: appointment.patientId.name,
        email: appointment.patientId.email,
        contact: appointment.patientId.contact,
      },
      appointment: {
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        status: appointment.status,
      },
      payment: payment
        ? {
            amount: payment.amount,
            transactionId: payment.transactionId,
            paymentStatus: payment.paymentStatus,
          }
        : { message: "Payment details not available" },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
