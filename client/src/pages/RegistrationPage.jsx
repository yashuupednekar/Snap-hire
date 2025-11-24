import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUserMd,
  FaMoneyBill,
  FaClock,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Patient",
    contact: "",
    specialization: "",
    experience: "",
    feesPerSession: "",
    availability: [],
    status: "Pending",
  });

  const [timeSlots, setTimeSlots] = useState([
    "10:00 AM - 12:00 PM",
    "3:00 PM - 5:00 PM",
    "6:00 PM - 8:00 PM",
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Availability Selection
  const handleAvailabilityChange = (day, timeSlot) => {
    setFormData((prev) => {
      const updatedAvailability = [...prev.availability];
      const existingDayIndex = updatedAvailability.findIndex(
        (item) => item.day === day
      );

      if (existingDayIndex !== -1) {
        if (
          updatedAvailability[existingDayIndex].timeSlots.includes(timeSlot)
        ) {
          updatedAvailability[existingDayIndex].timeSlots = updatedAvailability[
            existingDayIndex
          ].timeSlots.filter((slot) => slot !== timeSlot);

          if (updatedAvailability[existingDayIndex].timeSlots.length === 0) {
            updatedAvailability.splice(existingDayIndex, 1); // Remove day if no slots left
          }
        } else {
          updatedAvailability[existingDayIndex].timeSlots.push(timeSlot);
        }
      } else {
        updatedAvailability.push({ day, timeSlots: [timeSlot] });
      }

      return { ...prev, availability: updatedAvailability };
    });
  };

  // Handle Registration Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await axios.post("https://snap-hire.onrender.com/api/auth/register", submitData);

      alert("user registered successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Patient",
        contact: "",
        specialization: "",
        experience: "",
        feesPerSession: "",
        availability: [],
        status: "Pending",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Remove Time Slot Globally
  const removeTimeSlot = (slot) => {
    setTimeSlots((prev) => prev.filter((s) => s !== slot));

    // Remove this slot from all selected availability
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a) => ({
        ...a,
        timeSlots: a.timeSlots.filter((s) => s !== slot),
      })),
    }));
  };

  // Add New Time Slot
  const addTimeSlot = () => {
    const newSlot = prompt("Enter new time slot (e.g., 2:00 PM - 4:00 PM):");
    if (newSlot && !timeSlots.includes(newSlot)) {
      setTimeSlots((prev) => [...prev, newSlot]);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`, // Replace with your image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "700px",
          width: "100%",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white background
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#004D40" }}>
        <span style={{ color: "#4A2C2A" }}>Snap</span> {/* Rich Coffee Brown */}
        <span style={{ color: "#D2B48C" }}>Hire</span> {/* Warm Tan (Beige-Gold) */}
          <br />
          <span className="text-dark">Register</span>
        </h2>

        {error && (
          <div className="alert alert-danger text-center fw-bold" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-label="Full Name"
                />
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-label="Email"
                />
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <FaPhone />
                </span>
                <input
                  type="text"
                  name="contact"
                  className="form-control"
                  placeholder="Phone Number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  aria-label="Phone Number"
                />
              </div>

              <div className="mb-3">
                <select
                  name="role"
                  className="form-control rounded-pill border-2"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  aria-label="Role"
                >
                  <option value="Patient">User</option>
                  <option value="Doctor">Photographer</option>
                </select>
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-label="Password"
                />
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  aria-label="Confirm Password"
                />
              </div>
            </div>

            {/* Right Column (Doctor Fields) */}
            {formData.role === "Doctor" && (
              <div className="col-md-6">
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <FaUserMd />
                  </span>
                  <input
                    type="text"
                    name="specialization"
                    className="form-control"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    aria-label="Specialization"
                  />
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <FaClock />
                  </span>
                  <input
                    type="number"
                    name="experience"
                    className="form-control"
                    placeholder="Experience (Years)"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    aria-label="Experience"
                  />
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <FaMoneyBill />
                  </span>
                  <input
                    type="number"
                    name="feesPerSession"
                    className="form-control"
                    placeholder="Fees Per Session"
                    value={formData.feesPerSession}
                    onChange={handleChange}
                    required
                    min="0"
                    aria-label="Fees Per Session"
                  />
                </div>

                <div className="mb-3">
                  <h6>
                    <FaCalendarAlt /> Select Availability
                  </h6>

                  {daysOfWeek.map((day) => (
                    <div key={day} className="mb-2">
                      <strong>{day}:</strong>
                      <div className="d-flex flex-wrap">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`btn btn-sm m-1 ${
                              formData.availability.some(
                                (a) =>
                                  a.day === day && a.timeSlots.includes(slot)
                              )
                                ? "btn-success"
                                : "btn-outline-secondary"
                            }`}
                            onClick={() => handleAvailabilityChange(day, slot)}
                            aria-label={`Select ${slot} for ${day}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-3">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={addTimeSlot}
                    >
                      <FaPlus /> Add Time Slot
                    </button>
                  </div>

                  {timeSlots.length > 3 && (
                    <div className="mt-2">
                      <h6>Remove Time Slots:</h6>
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          className="btn btn-danger btn-sm m-1"
                          onClick={() => removeTimeSlot(slot)}
                        >
                          <FaTrash /> {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="text-center mt-3">
            <p className="mb-0">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-bold">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;