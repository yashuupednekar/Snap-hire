import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(
          `https://snap-hire.onrender.com/api/auth/doctor/${id}`
        );
        setDoctor(response.data);
        const days = response.data.availability.map((slot) => slot.day);
        setAvailableDays(days);
      } catch (error) {
        setError("Error fetching Photographer details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const dayOfWeek = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!availableDays.includes(dayOfWeek)) {
      alert("Photographer is not available on this day. Please select another date.");
      setDate("");
      setAvailableTimeSlots([]);
      return;
    }

    setDate(selectedDate);
    const selectedDaySlots = doctor.availability.find(
      (slot) => slot.day === dayOfWeek
    );
    setAvailableTimeSlots(selectedDaySlots ? selectedDaySlots.timeSlots : []);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Elements stripe={stripePromise}>
      <Navbar />
      <div className="container my-5">
        <div className="card p-4 shadow">
          <h2 className="text-primary text-center">Bookings</h2>
          <h4 className="text-center">Photographer {doctor.name}</h4>
          <p className="text-center">{doctor.specialization}</p>
          <p className="text-center">
            <strong>Fees:</strong> ₹{doctor.feesPerSession}
          </p>

          <div className="form-group">
            <label>Select Date:</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Select Time Slot:</label>
            <select
              className="form-control"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
              disabled={!date || availableTimeSlots.length === 0}
            >
              <option value="">Select Time</option>
              {availableTimeSlots.map((time, i) => (
                <option key={i} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <PaymentForm
            doctorId={id}
            date={date}
            timeSlot={timeSlot}
            fees={doctor.feesPerSession}
            navigate={navigate}
          />
        </div>
      </div>
      <Footer />
    </Elements>
  );
};

const PaymentForm = ({ doctorId, date, timeSlot, fees, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !date || !timeSlot || !cardholderName) {
      setError("Please fill all fields before proceeding.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: cardholderName },
      });

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://snap-hire.onrender.com/api/booking/book/${doctorId}`,
        { date, timeSlot, paymentMethodId: paymentMethod.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(" booking successfully!");
      navigate(`/appointment/${response.data.appointment._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="mt-4">
      <div className="form-group">
        <label>Cardholder Name:</label>
        <input
          type="text"
          className="form-control"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />
      </div>

      <div className="form-group mt-3">
        <label>Enter Card Details:</label>
        <div className="card p-3 mb-3">
          <CardElement className="form-control" />
        </div>
      </div>

      {error && <p className="text-danger mt-2">{error}</p>}
      <button
        type="submit"
        className="btn btn-success w-100"
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay ₹${fees} & Book`}
      </button>
    </form>
  );
};

export default BookAppointment;
