import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/style/ContactUs.css";
import Heroimg from "../assets/images/passport.jpg";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light" style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <header
        className="d-flex justify-content-center align-items-center text-center py-5 text-white vh-100"
        style={{
          background: `url(${Heroimg}) no-repeat top center`,
          backgroundSize: "cover",
          boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.4)", // Added dark overlay
        }}
      >
        <div className="container3">
          <h1 className="fw-bold mb-3 text-shadow">Contact Us</h1>
          <p className="lead mb-4 text-shadow">
            We are here to assist you with any queries. Reach out to us today!
          </p>
        </div>
      </header>

      {/* Contact Form Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-dark mb-4">Get In Touch</h2>
          <div className="row">
            <div className="col-md-6">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    id="name"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control shadow-sm"
                    id="email"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control shadow-sm"
                    id="message"
                    rows="4"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Address and Contact Information */}
            <div className="col-md-6">
              <h3 className="display-5 text-brown font-weight-bold mb-4">
                Our studio
              </h3>
              <div className="card p-4 shadow-sm mb-4">
                <address className="text-muted">
                  <p className="mb-3">
                    <strong className="text-dark">
                    SnapHire Photography Studio
                    </strong>
                  </p>
                  <p className="mb-3">
                    <i className="bi bi-house-door-fill text-primary fs-5"></i>
                    <span className="ms-2">456 Shutter Street, Suite 202</span>
                    <br />
                    <i className="bi bi-house-door-fill text-primary fs-5"></i>
                    <span className="ms-2">Lens City, LC 78901</span>
                  </p>
                  <p className="mb-3">
                    <strong>
                      <i className="bi bi-telephone-fill text-primary fs-5"></i>{" "}
                      Phone:
                    </strong>
                    <span className="text-dark ms-2">(123) 456-7890</span>
                    <br />
                    <strong>
                      <i className="bi bi-envelope-fill text-primary fs-5"></i>{" "}
                      Email:
                    </strong>
                    <span className="text-dark ms-2">
                      contact@SnapHire.com
                    </span>
                  </p>
                </address>
              </div>

              {/* Add a divider for separation */}
              <hr className="my-4" />

              {/* Social Media Links Section */}
              <h3 className="display-5 text-dark font-weight-bold mb-4">
                Follow Us
              </h3>
              <div className="d-flex gap-5 mb-4">
                <a
                  href="#"
                  className="text-decoration-none text-dark d-flex align-items-center fs-5 transition-all duration-300 hover-text-primary hover-scale"
                >
                  <i className="bi bi-facebook me-2 fs-4"></i>
                  <span>Facebook</span>
                </a>
                <a
                  href="#"
                  className="text-decoration-none text-dark d-flex align-items-center fs-5 transition-all duration-300 hover-text-primary hover-scale"
                >
                  <i className="bi bi-twitter me-2 fs-4"></i>
                  <span>Twitter</span>
                </a>
                <a
                  href="#"
                  className="text-decoration-none text-dark d-flex align-items-center fs-5 transition-all duration-300 hover-text-primary hover-scale"
                >
                  <i className="bi bi-instagram me-2 fs-4"></i>
                  <span>Instagram</span>
                </a>
              </div>
              <p className="text-muted">
                Stay connected with us on social media for the latest updates,
                news, and offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-dark mb-4">Our Location</h2>
          <div className="map-responsive">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.9474575438!2d-73.99845189240214!3d40.71277577932173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259f4d4a8de6f%3A0x79b9930bc8c8b07!2sNew%20York%2C%20NY%2010039%2C%20USA!5e0!3m2!1sen!2sin!4v1677581503311!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default ContactUs;
