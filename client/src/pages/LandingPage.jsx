import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import "../assets/style/LandingPage.css";
import Heroimg from "../assets/images/Carousel1.jpg";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("https://snap-hire.onrender.com/api/auth/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="bg-beige" style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <header
        className="hero-section d-flex justify-content-center align-items-center text-center py-5 vh-100"
        style={{
          background: `url(${Heroimg}) no-repeat top center`,
          backgroundSize: "cover",
        }}
      >
        <div className="container text-light-brown ">
          <h1 className="fw-bold mb-3">Book Your Photographer Easily</h1>
          <p className="lead mb-4">
            Fast, Secure, and Hassle-Free Booking
          </p>
          <button
            onClick={() => navigate("/book")}
            className="btn btn-primary btn-lg mt-3 px-4 py-2 rounded-pill shadow-lg"
          >
            Book Now
          </button>
        </div>
      </header>

      {/* Why Choose Us Section */}
      <section className="py-5 text-center bg-beige">
        <div className="container">
          <h2 className="fw-bold section-heading mb-4">Why Choose Us?</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[
              {
                title: "Professional Photographers",
                desc: "Hire skilled and experienced photographers for every occasion.",
                icon: "fa-camera",
              },
              {
                title: "Easy Online Booking",
                desc: "Book a photoshoot effortlessly in just a few clicks.",
                icon: "fa-calendar-alt",
              },
              {
                title: "High-Quality Results",
                desc: "Get stunning, high-resolution images that capture your moments perfectly.",
                icon: "fa-image",
              },
            ].map((feature, index) => (
              <div className="col" key={index}>
                <div className="card rounded-4 h-100 p-4 text-center">
                  <i className={`fa ${feature.icon} fa-4x text-primary mb-3`}></i>
                  <h3 className="card-title mb-3">{feature.title}</h3>
                  <p className="text-muted">{feature.desc}</p>
                  <button className="btn btn-outline-primary mt-3 px-4 py-2 rounded-pill shadow-sm">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-5 text-center bg-beige">
        <div className="container">
          <h2 className="fw-bold section-heading mb-4">Our Services</h2>
          <p className="lead mb-5 text-light-brown">
            Explore our premium photography services tailored for every occasion.
          </p>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[
              {
                title: "Event Photography",
                desc: "Capture unforgettable moments from weddings, birthdays, and corporate events.",
                icon: "fa-camera-retro",
              },
              {
                title: "Portrait & Fashion Shoots",
                desc: "Book professional portrait and fashion photography sessions.",
                icon: "fa-user",
              },
              {
                title: "Product Photography",
                desc: "High-quality product shots to enhance your brand and marketing.",
                icon: "fa-box",
              },
              {
                title: "Pre-Wedding & Wedding Shoots",
                desc: "Beautifully curated pre-wedding and wedding photoshoots.",
                icon: "fa-heart",
              },
              {
                title: "Travel & Landscape Photography",
                desc: "Scenic photography services for travel bloggers and adventurers.",
                icon: "fa-globe",
              },
              {
                title: "Editing & Retouching",
                desc: "Professional photo editing and retouching services for flawless results.",
                icon: "fa-magic",
              },
            ].map((service, index) => (
              <div className="col" key={index}>
                <div className="card rounded-4 h-100 p-4 text-center">
                  <i className={`fa ${service.icon} fa-4x text-primary mb-3`}></i>
                  <h3 className="card-title mb-3">{service.title}</h3>
                  <p className="text-muted">{service.desc}</p>
                  <button className="btn btn-outline-primary mt-3 px-4 py-2 rounded-pill shadow-sm">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-5 text-center bg-beige">
        <div className="container">
          <h2 className="fw-bold section-heading mb-4">Meet Our Photographers</h2>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div className="col" key={doctor._id}>
                    <div className="card rounded-4 h-100 p-4 text-center">
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        <img
                          src={
                            doctor.userId?.profileImage
                              ? `/uploads/${doctor.userId.profileImage}`
                              : "/assets/default-doctor.png"
                          }
                          alt={doctor.userId?.name || "Doctor"}
                          className="rounded-circle doctor-image"
                          width="120"
                          height="120"
                          onError={(e) => {
                            e.target.src = "/assets/default-doctor.png";
                          }}
                        />
                      </div>
                      <h3 className="card-title mb-2">
                        {doctor.userId?.name || "Unknown Doctor"}
                      </h3>
                      <p className="text-muted">{doctor.specialization || "N/A"}</p>
                      <p className="text-muted">
                        Experience: {doctor.experience ? `${doctor.experience} years` : "N/A"}
                      </p>
                      <p className="text-muted">Fees: ₹{doctor.feesPerSession || "N/A"}</p>
                      <button
                        className="btn btn-outline-primary mt-3 px-4 py-2 rounded-pill shadow-sm"
                        onClick={() => navigate(`/photographer/${doctor._id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Photographer available</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 text-center bg-beige">
        <div className="container">
          <h2 className="fw-bold section-heading mb-4">How It Works</h2>
          <p className="lead mb-5 text-light-brown">
            Booking a professional photographer is simple! Follow these steps.
          </p>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[
              {
                step: "Browse",
                desc: "Explore our list of skilled photographers by category and style.",
                icon: "fa-camera",
                bgColor: "bg-info",
                iconColor: "text-white",
              },
              {
                step: "Select",
                desc: "Choose a photographer based on their portfolio and availability.",
                icon: "fa-user-check",
                bgColor: "bg-success",
                iconColor: "text-white",
              },
              {
                step: "Book",
                desc: "Pick your date, confirm your booking, and get ready for stunning shots.",
                icon: "fa-calendar-check",
                bgColor: "bg-danger",
                iconColor: "text-white",
              },
            ].map((step, index) => (
              <div className="col" key={index}>
                <div className={`card rounded-4 h-100 p-4 text-center ${step.bgColor} text-white`}>
                  <i className={`fa ${step.icon} fa-4x mb-3 ${step.iconColor}`}></i>
                  <h3 className="card-title mb-3">{step.step}</h3>
                  <p className="card-text">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Achievements Section */}
      <section className="py-5 text-center bg-beige">
        <div className="container">
          <h2 className="fw-bold section-heading mb-4">Our Achievements</h2>
          <p className="lead mb-5 text-light-brown">
            With thousands of successful shoots, we are committed to capturing your perfect moments.
          </p>
          <div className="row justify-content-center">
            {[
              {
                title: "10,000+",
                desc: "Photoshoots Completed",
                icon: "fa-camera-retro",
              },
              { title: "500+", desc: "Professional Photographers", icon: "fa-user" },
              { title: "99%", desc: "Customer Satisfaction", icon: "fa-smile" },
              { title: "50+", desc: "Cities Covered", icon: "fa-map-marker-alt" },
            ].map((achievement, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="text-center p-4 rounded-3 bg-transparent">
                  <i className={`fa ${achievement.icon} fa-4x text-primary mb-3`}></i>
                  <h3 className="card-title mb-2">{achievement.title}</h3>
                  <p className="text-muted">{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 text-center bg-beige">
        <div className="container">
          <h2 className="fw-bold section-heading mb-4">What Our Users Say</h2>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {[
              {
                quote:
                  "This platform made it so easy to book my photographer. Highly recommend!",
                name: "Sarah M.",
              },
              {
                quote:
                  "Great experience! Found the best photographer in my area without hassle.",
                name: "John D.",
              },
            ].map((testimonial, index) => (
              <div className="col" key={index}>
                <blockquote className="blockquote">
                  <p className="mb-3 fst-italic">"{testimonial.quote}"</p>
                  <footer className="blockquote-footer">
                    {testimonial.name}
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
<section className="py-5 text-center bg-beige">
  <div className="container">
    <h2 className="fw-bold mb-4 text-light-brown">Get Started Today</h2>
    <p className="lead mb-5 text-light-brown">
      Join thousands of satisfied users already benefiting from seamless booking!
    </p>
    <button
      onClick={() => navigate("/book")}
      className="btn btn-primary btn-lg mt-3 px-4 py-2 rounded-pill shadow-lg"
    >
      Start Booking
    </button>
  </div>
</section>
      <Footer />
    </div>
  );
};

export default LandingPage;