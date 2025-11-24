import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUserAlt,
  FaEnvelope,
  FaEdit,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.isAdmin) {
        navigate("/admin-dashboard");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg p-4 rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <h1>
            <span className="text-danger">Snap</span>
            <span className="text-primary">Hire</span>
          </h1>
          <h2>Profile</h2>
        </div>

        {user ? (
          <div className="text-center">
            <FaUserAlt size={60} className="mb-3 text-primary" />
            <h4>{user.name}</h4>
            <p className="text-muted">
              <FaEnvelope className="me-2" /> {user.email}
            </p>
            <button
              className="btn btn-primary w-100 mb-2"
              onClick={handleEditProfile}
            >
              <FaEdit className="me-2" /> Edit Profile
            </button>
            <button
              className="btn btn-warning w-100 mb-2"
              onClick={handleChangePassword}
            >
              <FaLock className="me-2" /> Change Password
            </button>
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </div>
        ) : (
          <p className="text-center">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
