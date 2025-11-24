const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  feesPerSession: { type: Number, required: true },
  availability: [
    {
      day: { type: String, required: true },
      timeSlots: [{ type: String, required: true }], // Example: ["10:00 AM - 12:00 PM", "3:00 PM - 5:00 PM"]
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
