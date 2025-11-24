import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import AboutPage from "../pages/AboutUsPage";
import ServicePage from "../pages/ServicesPage";
import ContactUs from "../pages/ContactUsPage";
import LoginPage from "../pages/LoginPage";
import RegisterForm from "../pages/RegistrationPage";
import ProfilePage from "../pages/ProfilePage";
import AdminDashboard from "../pages/AdminDashboard";
import NotFoundPage from "../pages/NotFoundPage";
import DoctorProfile from "../pages/DoctorProfile";
import BookAppointment from "../pages/BookAppointment";
import AppointmentDetails from "../pages/AppointmentDetails";
import DoctorList from "../pages/DoctorList";
import PatientProfile from "../pages/PatientProfile";
import DoctorDashboard from "../pages/DoctorDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicePage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/book" element={<DoctorList />} />
      <Route
        path="/appointment/:appointmentId"
        element={
          <ProtectedRoute>
            <AppointmentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/photographer/:id"
        element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/photographer-dashboard"
        element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book/:id" // Use :id as a route parameter
        element={
          <ProtectedRoute>
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      {/* Catch-all route for 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
