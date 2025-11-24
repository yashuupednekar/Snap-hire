import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/style/AppoinmentInvoice.css";
import { Spinner, Alert, Button, Card, Table } from "react-bootstrap";

const AppointmentInvoice = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://snap-hire.onrender.com/api/appointments/details/${appointmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setAppointment(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load appointment.");
        setLoading(false);
      });
  }, [appointmentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div ref={invoiceRef} className="invoice p-4 shadow-lg bg-white">
          {/* Invoice Header */}
          <div className="text-center mb-4">
            <h2 className="text-primary mb-2">Booking Invoice</h2>
            <p className="text-muted">Thank you for choosing our services.</p>
          </div>

          {/* Invoice Details */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="text-success">Photographer Details</h5>
              <p>
                <strong>Name:</strong> Photographer {appointment.doctor.name}
              </p>
              <p>
                <strong>Specialization:</strong>{" "}
                {appointment.doctor.specialization}
              </p>
              <p>
                <strong>Fees Per Session:</strong> ₹{appointment.doctor.fees}
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <h5 className="text-info">Invoice Details</h5>
              <p>
                <strong>Invoice No:</strong> INV-{appointment.appointment.id}
              </p>
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="mb-4">
            <h5 className="text-info">User Details</h5>
            <p>
              <strong>Name:</strong> {appointment.patient.name}
            </p>
            <p>
              <strong>Email:</strong> {appointment.patient.email}
            </p>
            <p>
              <strong>Contact:</strong> {appointment.patient.contact}
            </p>
          </div>

          {/* Appointment Details */}
          <div className="mb-4">
            <h5 className="text-warning">Booking Details</h5>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.appointment.date).toDateString()}
            </p>
            <p>
              <strong>Time Slot:</strong> {appointment.appointment.timeSlot}
            </p>
            <p
              className={`fw-bold ${
                appointment.appointment.status === "Pending"
                  ? "text-warning"
                  : appointment.appointment.status === "Completed"
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              <strong>Status:</strong> {appointment.appointment.status}
            </p>
          </div>

          {/* Payment Details */}
          <div className="mb-4">
            <h5 className="text-primary">Payment Details</h5>
            {appointment.payment.amount ? (
              <Table bordered className="mt-3">
                <tbody>
                  <tr>
                    <td>
                      <strong>Amount Paid</strong>
                    </td>
                    <td>₹{appointment.payment.amount}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Transaction ID</strong>
                    </td>
                    <td>{appointment.payment.transactionId}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Payment Status</strong>
                    </td>
                    <td
                      className={
                        appointment.payment.paymentStatus === "Success"
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {appointment.payment.paymentStatus}
                    </td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <p className="text-danger">
                <strong>Payment details not available.</strong>
              </p>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-4">
            <p className="text-muted">
              If you have any questions, please contact us at
              support@studio.com.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-4">
          <Button variant="primary" onClick={handlePrint} className="me-3">
            Print Invoice
          </Button>
          <Button variant="secondary" onClick={() => navigate("/appointments")}>
            Back to Bookings
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentInvoice;
