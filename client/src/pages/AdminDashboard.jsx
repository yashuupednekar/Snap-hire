import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Navbar,
  Nav,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminDashboardStats from "./AdminDashboardStats";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState({
    stats: false,
    users: false,
    doctors: false,
    appointments: false,
    payments: false,
  });
  const [activeSection, setActiveSection] = useState("stats"); // Default section
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading((prev) => ({ ...prev, stats: true }));
      const statsRes = await axios.get(
        "http://localhost:5000/api/admin/dashboard/stats"
      );
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      const usersRes = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading((prev) => ({ ...prev, doctors: true }));
      const doctorsRes = await axios.get(
        "http://localhost:5000/api/admin/doctors"
      );
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error("Error fetching Phtographer:", error);
    } finally {
      setLoading((prev) => ({ ...prev, doctors: false }));
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading((prev) => ({ ...prev, appointments: true }));
      const appointmentsRes = await axios.get(
        "http://localhost:5000/api/admin/appointments"
      );
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error("Error fetching Booking:", error);
    } finally {
      setLoading((prev) => ({ ...prev, appointments: false }));
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading((prev) => ({ ...prev, payments: true }));
      const paymentsRes = await axios.get(
        "http://localhost:5000/api/admin/payments"
      );
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading((prev) => ({ ...prev, payments: false }));
    }
  };

  const updateDoctorStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/doctor/${id}/status`, {
        status,
      });
      fetchDoctors(); // Refresh doctors list
    } catch (error) {
      console.error("Error updating Photographer status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "stats":
        return <AdminDashboardStats />;
      case "users":
        return (
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              {loading.users ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th> <th>Name</th> <th>Email</th> <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td> <td>{user.name}</td>{" "}
                        <td>{user.email}</td> <td>{user.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        );
      case "doctors":
        return (
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Photographer</Card.Title>
              {loading.doctors ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th> <th>Name</th> <th>Email</th> <th>Contact</th>{" "}
                      <th>Status</th> <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor, index) => (
                      <tr key={doctor._id}>
                        <td>{index + 1}</td>
                        <td>{doctor.userId?.name || "N/A"}</td>
                        <td>{doctor.userId?.email || "N/A"}</td>
                        <td>{doctor.userId?.contact || "N/A"}</td>
                        <td>
                          <Badge
                            bg={
                              doctor.status === "Approved"
                                ? "success"
                                : "warning"
                            }
                          >
                            {doctor.status}
                          </Badge>
                        </td>
                        <td>
                          {doctor.status !== "Approved" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                updateDoctorStatus(doctor._id, "Approved")
                              }
                            >
                              Approve
                            </Button>
                          )}
                          {doctor.status !== "Rejected" && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                updateDoctorStatus(doctor._id, "Rejected")
                              }
                            >
                              Reject
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        );
      case "appointments":
        return (
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Bookings</Card.Title>
              {loading.appointments ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th> <th>Photoggrapher</th> <th>User</th>{" "}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td>{index + 1}</td>
                        <td>{appointment.doctorId?.specialization || "N/A"}</td>
                        <td>{appointment.patientId?.name || "N/A"}</td>
                        <td>
                          <Badge
                            bg={
                              appointment.status === "Pending"
                                ? "warning"
                                : "success"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        );
      case "payments":
        return (
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Payments</Card.Title>
              {loading.payments ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th> <th>Photographer</th> <th>User</th>{" "}
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={payment._id}>
                        <td>{index + 1}</td>
                        <td>{payment.doctorId?.specialization || "N/A"}</td>
                        <td>{payment.patientId?.name || "N/A"}</td>
                        <td>${payment.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Secondary Navbar */}
      <Navbar bg="light" variant="light" className="mb-4">
        <Container>
          <Nav>
            <Nav.Link
              active={activeSection === "stats"}
              onClick={() => setActiveSection("stats")}
            >
              Stats
            </Nav.Link>
            <Nav.Link
              active={activeSection === "users"}
              onClick={() => {
                setActiveSection("users");
                fetchUsers();
              }}
            >
              Users
            </Nav.Link>
            <Nav.Link
              active={activeSection === "doctors"}
              onClick={() => {
                setActiveSection("doctors");
                fetchDoctors();
              }}
            >
              photographer
            </Nav.Link>
            <Nav.Link
              active={activeSection === "appointments"}
              onClick={() => {
                setActiveSection("appointments");
                fetchAppointments();
              }}
            >
              Booking
            </Nav.Link>
            <Nav.Link
              active={activeSection === "payments"}
              onClick={() => {
                setActiveSection("payments");
                fetchPayments();
              }}
            >
              Payments
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {/* Render Active Section */}
        {renderSection()}
      </Container>
    </>
  );
};

export default AdminDashboard;
