import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaCalendarAlt,
  FaSignOutAlt,
  FaMoneyBillAlt,
  FaStar,
  FaBars,
  FaChartLine,
} from "react-icons/fa";
import "../assets/style/DocDash.css";
import DoctorReports from "./DoctorReports";
import Dashboard from "./DocDashboard/Dashboard";
import Payment from "./DocDashboard/Payment";

const DoctorDashboard = () => {
  const [doctorName, setDoctorName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "Doctor") {
      navigate("/login");
    }

    setDoctorName(localStorage.getItem("doctorName") || "Photographer");
    fetchReviews();
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://snap-hire.onrender.com/api/doctors/reviews`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      alert("Failed to fetch reviews. Please try again.");
    }
  };

  const handleAppointmentAction = async (appointmentId, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://snap-hire.onrender.com/api/doctors/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update booking status");

      alert(`Appointment marked as ${status}!`);
      fetchAppointments(); // Refresh appointments list after update
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Something went wrong!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Render the active section dynamically
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "payments":
        return <Payment />;
      case "report":
        return (
          <>
            <DoctorReports appointments={appointments} />
          </>
        );
      case "reviews":
        return (
          <div>
            <h2>Reviews</h2>
            <p className="text-muted">List of your reviews:</p>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <tr key={review._id}>
                        <td>{index + 1}</td>
                        <td>{review.patientId.name}</td>
                        <td>{review.rating} / 5</td>
                        <td>{review.comment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Appointments",
      icon: <FaCalendarAlt className="me-2" />,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <FaMoneyBillAlt className="me-2" />,
    },
    { id: "reviews", label: "Reviews", icon: <FaStar className="me-2" /> },
    // { id: "report", label: "Report", icon: <FaChartLine className="me-2" /> },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar (Hidden on Small Screens) */}
        <div
          className={`col-md-3 bg-sea text-white min-vh-100 p-4 d-none d-md-block`}
        >
          <h3 className="mb-4">
            <FaUserMd className="me-2" /> {doctorName}
          </h3>
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.id}>
                <button
                  className="nav-link text-white btn btn-link text-start w-100"
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
            <li className="nav-item mt-3">
              <button className="btn btn-danger w-100" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Sidebar (Offcanvas) */}
        <div className="d-md-none p-3 bg-sea text-white d-flex justify-content-between">
          <h4>
            <FaUserMd className="me-2" /> {doctorName}
          </h4>
          <button
            className="btn btn-light"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
        </div>

        {sidebarOpen && (
          <div className="d-md-none bg-dark text-white p-4 position-fixed top-0 start-0 w-75 vh-100 shadow-lg">
            <button
              className="btn btn-danger mb-3"
              onClick={() => setSidebarOpen(false)}
            >
              Close
            </button>
            <ul className="nav flex-column">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.id}>
                  <button
                    className="nav-link text-white btn btn-link text-start w-100"
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    {item.icon} {item.label}
                  </button>
                </li>
              ))}
              <li className="nav-item mt-3">
                <button className="btn btn-danger w-100" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="col-md-9 p-4 bg-light-sea">{renderSection()}</div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
