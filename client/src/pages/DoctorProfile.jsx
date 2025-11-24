import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/style/DoctorProfile.css";

const DoctorProfile = () => {
  const { id } = useParams(); // Get doctor ID from URL
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch doctor details and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorResponse, reviewsResponse] = await Promise.all([
          axios.get(`https://snap-hire.onrender.com/api/auth/doctor/${id}`),
          axios.get(`https://snap-hire.onrender.com/api/rating/doctor/${id}`),
        ]);
        setDoctor(doctorResponse.data || {});
        setReviews(reviewsResponse.data || []);
        calculateAverageRating(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = totalRating / reviews.length;
    setAverageRating(avg.toFixed(1)); // Round to 1 decimal place
  };

  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = isEditing
        ? await axios.put(
            `https://snap-hire.onrender.com/api/rating/${editReviewId}`,
            reviewForm,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.post(
            `https://snap-hire.onrender.com/api/rating`,
            { ...reviewForm, doctorId: id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

      if (isEditing) {
        const updatedReviews = reviews.map((review) =>
          review._id === editReviewId ? response.data : review
        );
        setReviews(updatedReviews);
        calculateAverageRating(updatedReviews);
        setIsEditing(false);
        setEditReviewId(null);
      } else {
        const updatedReviews = [...reviews, response.data];
        setReviews(updatedReviews);
        calculateAverageRating(updatedReviews);
      }
      setReviewForm({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  // Handle review edit
  const handleEditReview = (review) => {
    setReviewForm({ rating: review.rating, comment: review.comment });
    setIsEditing(true);
    setEditReviewId(review._id);
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://snap-hire.onrender.com/api/rating/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedReviews = reviews.filter(
        (review) => review._id !== reviewId
      );
      setReviews(updatedReviews);
      calculateAverageRating(updatedReviews);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  // Star Rating Component
  const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="star-rating">
        {stars.map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""}`}
            onClick={() => onRatingChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h2 className="text-danger">{error}</h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <div className="card shadow-lg p-4 border-0 rounded-4">
          <div className="row g-5 align-items-center">
            {/* Doctor Image Section */}
            <div className="col-md-4 text-center">
              <img
                src={
                  doctor?.userId?.profileImage
                    ? `https://snap-hire.onrender.com/uploads/${
                        doctor.userId.profileImage
                      }?t=${new Date().getTime()}`
                    : "https://via.placeholder.com/150"
                }
                alt={doctor?.userId?.name || "Photographer"}
                className="rounded-circle img-fluid border border-3 border-primary"
                style={{ width: "220px", height: "220px", objectFit: "cover" }}
              />
              <h3 className="mt-3 text-primary fw-bold">
                {doctor?.userId?.name || "Unknown Photographer"}
              </h3>
              <p className="text-muted fs-5">
                {doctor?.specialization || "Specialization not available"}
              </p>
              {/* Average Rating */}
              <div className="mt-3">
                <h5 className="text-primary">Average Rating</h5>
                <div className="d-flex align-items-center justify-content-center">
                  <StarRating rating={averageRating} />
                  <span className="ms-2 fw-bold">{averageRating}/5</span>
                </div>
              </div>
            </div>

            {/* Doctor Details Section */}
            <div className="col-md-8">
              <div className="card-body">
                <div className="mb-3">
                  <strong className="text-dark">Experience:</strong>{" "}
                  <span className="text-secondary">
                    {doctor?.experience ? `${doctor.experience} years` : "N/A"}
                  </span>
                </div>

                <div className="mb-3">
                  <strong className="text-dark">Fees per Event:</strong>{" "}
                  <span className="text-success fw-bold">
                    ₹{doctor?.feesPerSession || "N/A"}
                  </span>
                </div>

                <div className="mb-3">
                  <strong className="text-dark">Contact:</strong>{" "}
                  <span className="text-secondary">
                    {doctor?.userId?.contact || "Not provided"}
                  </span>
                </div>

                {/* Availability Section */}
                <h4 className="mt-4 text-primary">Available Timings</h4>
                <div className="d-flex flex-wrap gap-2">
                  {doctor?.availability && doctor.availability.length > 0 ? (
                    doctor.availability.map((slot, index) => (
                      <div key={index} className="mb-3">
                        <strong className="text-dark">{slot.day}:</strong>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {slot.timeSlots && slot.timeSlots.length > 0 ? (
                            slot.timeSlots.map((time, i) => (
                              <span
                                key={i}
                                className="badge bg-primary rounded-pill px-3 py-2"
                              >
                                {time}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">
                              No slots available
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">
                      No availability information provided
                    </p>
                  )}
                </div>

                {/* Book Appointment Button */}
                <button
                  className="btn btn-primary btn-lg mt-4 w-100 rounded-pill shadow-sm"
                  onClick={() => navigate(`/book/${doctor?._id}`)}
                >
                  <i className="fas fa-calendar-check me-2"></i> Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="card shadow-lg p-4 border-0 rounded-4 mt-5">
          <h3 className="text-primary mb-4">User Reviews</h3>

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">
                Rating
              </label>
              <StarRating
                rating={reviewForm.rating}
                onRatingChange={(rating) =>
                  setReviewForm({ ...reviewForm, rating })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">
                Comment
              </label>
              <textarea
                id="comment"
                className="form-control"
                rows="3"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Review" : "Submit Review"}
            </button>
          </form>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">
                      {review.patientId?.name || "Anonymous"}
                    </h5>
                    <div>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="card-text">{review.comment}</p>
                  <div className="d-flex align-items-center">
                    <StarRating rating={review.rating} />
                    <span className="ms-2 fw-bold">{review.rating}/5</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No reviews yet.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorProfile;
