const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Payment = require("../models/Payment");
const User = require("../models/User"); // Import User model
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

exports.bookAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId } = req.params;
    const { date, timeSlot, paymentMethodId } = req.body;

    if (!doctorId || !date || !timeSlot || !paymentMethodId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isSlotAvailable = doctor.availability.some((dayObj) =>
      dayObj.timeSlots.includes(timeSlot)
    );

    if (!isSlotAvailable) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not available" });
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });
    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "Time slot already booked, choose another slot." });
    }

    // Retrieve User Details
    const user = await User.findById(patientId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userEmail = user.email;

    // Process Payment with Stripe
    const amount = doctor.feesPerSession * 100; // Convert to cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    if (paymentIntent.status !== "succeeded") {
      return res
        .status(400)
        .json({ message: "Payment failed. Please try again." });
    }

    // Create Appointment
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date,
      timeSlot,
      status: "Pending",
      paymentStatus: "Paid",
    });

    await newAppointment.save();

    // Store Payment Record
    const newPayment = new Payment({
      appointmentId: newAppointment._id,
      patientId,
      doctorId,
      amount: doctor.feesPerSession,
      transactionId: paymentIntent.id,
      paymentMethod: paymentMethodId,
      paymentStatus: "Success",
    });

    await newPayment.save();

    // Send Confirmation Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    console.log("Recipient Email:", userEmail); // Debugging

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail, // Corrected to fetch from User model
      subject: "Appointment Confirmation & Invoice",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <h2 style="text-align: center; color: #004D40;">Appointment Confirmation</h2>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your appointment with <strong>Dr. ${doctor.name}</strong> has been successfully booked.</p>
          <h3 style="color: #FF6F61;">Appointment Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Doctor:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px;">Dr. ${doctor.name}</td></tr>
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Date:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px;">${date}</td></tr>
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Time Slot:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px;">${timeSlot}</td></tr>
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Status:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px;">Pending</td></tr>
          </table>
          <h3 style="color: #FF6F61;">Payment Summary:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Amount Paid:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px;">$${doctor.feesPerSession}</td></tr>
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Transaction ID:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px;">${paymentIntent.id}</td></tr>
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Payment Method:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px;">Credit/Debit Card</td></tr>
            <tr><td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Payment Status:</strong></td><td style="border-bottom: 1px solid #ddd; padding: 8px; color: green;"><strong>Paid</strong></td></tr>
          </table>
          <p style="text-align: center; font-size: 14px; color: #555;">If you have any questions, please contact our support team.</p>
          <p style="text-align: center; font-size: 14px; color: #004D40;">Thank you for choosing our service!</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending failed:", error);
      } else {
        console.log("Confirmation email sent:", info.response);
      }
    });

    return res.status(201).json({
      message: "Appointment booked successfully! Invoice sent via email.",
      appointment: newAppointment,
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error processing booking:", error);

    if (error.type === "StripeCardError") {
      return res
        .status(400)
        .json({ message: "Payment declined. Please try another card." });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid input data." });
    }

    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};
