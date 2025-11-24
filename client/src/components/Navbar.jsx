import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // User profile icon

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/"; // Redirect to home
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top">
      <div className="container-fluid px-3">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-3 text-primary" to="/">
        <span style={{ color: "#4A2C2A" }}>Snap</span> {/* Rich Coffee Brown */}
        <span style={{ color: "#D2B48C" }}>Hire</span> {/* Warm Tan (Beige-Gold) */}
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3 text-dark" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3 text-dark" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 text-dark"
                to="/services"
              >
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 text-dark"
                to="/contact"
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="btn btn-danger fw-semibold px-4 py-2 rounded-pill me-2"
                to="/book"
              >
                Bookings
              </Link>
            </li>
            {/* Conditional Rendering Based on Authentication */}
            {isAuthenticated ? (
              <>
                {/* Role-Based Navigation */}
                {role === "admin" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link fw-semibold px-3 text-dark"
                      to="/admin-dashboard"
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
                {role === "doctor" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link fw-semibold px-3 text-dark"
                      to="/photographer-dashboard"
                    >
                      Doctor Dashboard
                    </Link>
                  </li>
                )}
                {role === "patient" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link fw-semibold px-3 text-dark"
                      to="/user-dashboard"
                    >
                      My Bookings
                    </Link>
                  </li>
                )}

                {/* User Profile Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                    id="navbarDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUserCircle className="fs-2 me-1" />
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/user-dashboard">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex align-items-center">
                <Link
                  className="btn btn-primary fw-semibold px-4 py-2 rounded-pill"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
