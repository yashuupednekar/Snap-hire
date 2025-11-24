const express = require("express");
const connectDB = require("./config/Connection");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(helmet()); // Security middleware
app.use(morgan("dev")); // HTTP request logger

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from React frontend
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization"], // Expose necessary headers
  })
);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173"); // Allow frontend origin
      res.set("Cache-Control", "no-store"); // Prevent caching
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

const appointmentRoutes = require("./routes/appointmentRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/docRoutes");

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/rating", require("./routes/ratingsRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
