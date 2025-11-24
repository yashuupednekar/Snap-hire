import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Button,
} from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [availability, setAvailability] = useState("");
  const [feesRange, setFeesRange] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://snap-hire.onrender.com/api/auth/doctors")
      .then((response) => {
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      });
  }, []);

  // Filtering function
  useEffect(() => {
    let updatedDoctors = [...doctors];

    if (specialization) {
      updatedDoctors = updatedDoctors.filter(
        (doc) => doc.specialization === specialization
      );
    }

    if (availability) {
      updatedDoctors = updatedDoctors.filter((doc) =>
        doc.availability.some((slot) => slot.day === availability)
      );
    }

    if (feesRange) {
      const [minFee, maxFee] = feesRange.split("-").map(Number);
      updatedDoctors = updatedDoctors.filter(
        (doc) => doc.feesPerSession >= minFee && doc.feesPerSession <= maxFee
      );
    }

    if (sortBy === "experience") {
      updatedDoctors.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === "fees") {
      updatedDoctors.sort((a, b) => a.feesPerSession - b.feesPerSession);
    }

    setFilteredDoctors(updatedDoctors);
  }, [specialization, sortBy, availability, feesRange, doctors]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center vh-100 align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="my-5">
        <h2 className="text-center text-dark mb-4">Available Photographer</h2>

        {/* Filters */}
        <Row className="mb-4">
          <Col md={3}>
            <Form.Select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              {[...new Set(doctors.map((doc) => doc.specialization))].map(
                (spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                )
              )}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">All Days</option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={feesRange}
              onChange={(e) => setFeesRange(e.target.value)}
            >
              <option value="">All Fees</option>
              <option value="5000-10000">₹5000 - 10000</option>
              <option value="10000-15000">₹10000 - ₹15000</option>
              <option value="15000-20000">₹15000 - ₹20000</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="experience">Experience (High to Low)</option>
              <option value="fees">Fees (Low to High)</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Doctors List */}
        <Row>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Col md={4} key={doctor._id} className="mb-4">
                <Card className="shadow h-100">
                  <Card.Body className="d-flex flex-column">
                    {/* Doctor Name and Specialization */}
                    <Card.Title className="text-primary">
                      {doctor.userId?.name || "N/A"}
                    </Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">
                      {doctor.specialization}
                    </Card.Subtitle>

                    {/* Doctor Details */}
                    <div className="mb-3">
                      <p className="mb-1">
                        <strong>Experience:</strong> {doctor.experience} years
                      </p>
                      <p className="mb-1">
                        <strong>Fees Per Session:</strong> ₹
                        {doctor.feesPerSession}
                      </p>
                      <p className="mb-1">
                        <strong>Contact:</strong>{" "}
                        {doctor.userId?.contact || "N/A"}
                      </p>
                    </div>

                    {/* Availability */}
                    <div className="mb-3">
                      <strong>Availability:</strong>
                      {doctor.availability.map((slot) => (
                        <div key={slot.day} className="mt-2">
                          <strong>{slot.day}:</strong>
                          <div className="d-flex flex-wrap gap-2 mt-1">
                            {slot.timeSlots.map((time, index) => (
                              <span
                                key={index}
                                className="badge bg-secondary rounded-pill p-2"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View Details Button */}
                    <Button
                      variant="primary"
                      className="mt-auto w-100"
                      onClick={() => navigate(`/photographer/${doctor._id}`)}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p className="text-danger fs-5">
                No Photograher found matching criteria.
              </p>
            </Col>
          )}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default DoctorList;
