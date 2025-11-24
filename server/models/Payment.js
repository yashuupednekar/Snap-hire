const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  paymentMethod: {
    type: String,
    required: true, // Keep it required but remove enum restriction
  },
  paymentStatus: {
    type: String,
    enum: ["Success", "Failed"],
    default: "Success",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
