import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    profileImage: null, // For file upload
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          setError("Unauthorized: No token found");
          setLoading(false);
          toast.error("Unauthorized: No token found"); // Error toast
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/patient/profile",
          {
            headers: { Authorization: `Bearer ${token}` }, // Send token in header
          }
        );

        setPatient(response.data.patient);
        setAppointments(response.data.appointments);
        setLoading(false);
        toast.success("User data fetched successfully!"); // Success toast
      } catch (err) {
        console.error("Error fetching User data:", err);
        setError("Failed to load User data.");
        setLoading(false);
        toast.error("Failed to load User data. Please try again."); // Error toast
      }
    };

    fetchPatientData();
  }, []);

  const handleEditProfile = () => {
    setFormData({
      name: patient.name,
      email: patient.email,
      contact: patient.contact,
      profileImage: null, // Reset file input
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("contact", formData.contact);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const response = await axios.put(
        "http://localhost:5000/api/patient/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Required for file upload
          },
        }
      );

      setPatient(response.data.patient); // Update patient data
      setShowEditModal(false); // Close the modal
      toast.success("Profile updated successfully!"); // Success toast
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again."); // Error toast
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/patient/appointment/cancel/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Remove the canceled appointment from the list
      setAppointments(
        appointments.filter((appointment) => appointment._id !== appointmentId)
      );
      toast.success("Booking canceled successfully!"); // Success toast
    } catch (err) {
      console.error("Error canceling Booking:", err);
      toast.error("Failed to cancel Booking. Please try again."); // Error toast
    }
  };

  const handleViewAppointmentDetails = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`);
    toast.info("Navigating to Booking details..."); // Info toast
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center vh-100 align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  return (
    <>
      <Navbar />
      <Container className="my-5">
        {/* Toast Container */}
        

        <h2 className="text-center text-dark mb-4">User Profile</h2>
        <Card className="shadow-lg p-4">
          <Row>
            <Col
              md={4}
              className="d-flex justify-content-center align-items-center"
            >
              <img
                src={
                  patient.profileImage
                    ? `/uploads/${patient.profileImage}`
                    : "https://via.placeholder.com/150"
                }
                alt="User"
                className="rounded-circle"
                width="150"
                height="150"
                style={{ objectFit: "cover" }}
              />
            </Col>
            <Col md={8}>
              <h3>{patient.name}</h3>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
              <p>
                <strong>Contact:</strong> {patient.contact || "N/A"}
              </p>
              {/* <p>
                <strong>Role:</strong> {patient.role}
              </p> */}
              <Button variant="primary" onClick={handleEditProfile}>
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Appointments Section */}
        <h4 className="mt-5">Upcoming Booking</h4>
        {appointments.length > 0 ? (
          <Row>
            {appointments.map((appointment) => (
              <Col md={6} key={appointment._id} className="mb-4">
                <Card className="shadow-sm p-3">
                  <p>
                    <strong>Photographer</strong> {appointment.doctorName}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {appointment.timeSlot}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-success">{appointment.status}</span>
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      variant="info"
                      onClick={() =>
                        handleViewAppointmentDetails(appointment._id)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">No upcoming bookings</p>
        )}

        {/* Edit Profile Modal */}
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Profile Image</Form.Label>
                <Form.Control
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  accept="image/*" // Allow only image files
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={styles.toastContainer}
        toastStyle={styles.toast}
        progressStyle={styles.progress}
      />
      </Container>
      <Footer />
    </>
  );
};
const styles = {
  container: {
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#000',
    color: '#fff',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    animation: 'spin 5s linear infinite', // Logo animation
  },
  logo: {
    width: '50px',
    height: '50px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: '0',
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: '10px 0 0',
    opacity: '0.8',
  },
  main: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  bookingForm: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '100%',
  },
  formTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '100px',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff7e5f',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#feb47b',
    },
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#000',
    color: '#fff',
    marginTop: 'auto',
  },
  footerText: {
    margin: '0',
    fontSize: '0.9rem',
  },
  toastContainer: {
    borderRadius: '10px',
  },
  toast: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  progress: {
    background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
  },
};

// Add keyframes for logo animation
const spin = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Inject the animation into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spin, styleSheet.cssRules.length);

export default PatientProfile;
