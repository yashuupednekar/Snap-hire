import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assets/style/ServicePage.css";
import Footer from "../components/Footer";
import Heroimg from "../assets/images/service.jpg";

const ServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light" style={{ fontFamily: "Alex, sans-serif" }}>
      <Navbar />

      <header
        className="d-flex justify-content-center align-items-center text-center py-5 text-white vh-100"
        style={{
          background: `url(${Heroimg}) no-repeat top center`,
          backgroundSize: "cover",
        }}
      >
     <div className="container2 text-dark text-center">
  <h1 className="fw-bold text-white text-uppercase text-shadow-lg" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "2px" }}>
    Capture Moments, Create Memories
  </h1>
  <p className="lead mb-4 text-white text-opacity-75" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.2rem", lineHeight: "1.6" }}>
    We don’t just take pictures—we craft timeless stories. Experience professional photography that brings your special moments to life with creativity, passion, and perfection.
  </p>
</div>



      </header>

      {/* Services Overview Section */}
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h2 className="fw-bold text-dark mb-4">Explore Our Services</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[
              
                {
                  title: "Event Photography",
                  desc: "Capture stunning moments from weddings, parties, and corporate events.",
                  icon: "fa-camera-retro",
                },
                {
                  title: "Portrait & Fashion Shoots",
                  desc: "Professional portrait and fashion photography for individuals and brands.",
                  icon: "fa-user",
                },
                {
                  title: "Product Photography",
                  desc: "High-quality product images to enhance your brand's marketing and sales.",
                  icon: "fa-box",
                },
                {
                  title: "Pre-Wedding & Wedding Shoots",
                  desc: "Beautifully curated pre-wedding and wedding photography sessions.",
                  icon: "fa-heart",
                },
                {
                  title: "Travel & Landscape Photography",
                  desc: "Scenic photography services for travel bloggers and adventurers.",
                  icon: "fa-globe",
                },
                {
                  title: "Editing & Retouching",
                  desc: "Professional photo editing and retouching to perfect every shot.",
                  icon: "fa-magic",
                },
              
              
            ].map((service, index) => (
              <div className="col" key={index}>
                <div className="service-box mb-4">
                  <i
                    className={`fa ${service.icon} fa-3x text-dark mb-3`}
                  ></i>
                  <h3 className="text-dark mb-3">{service.title}</h3>
                  <p className="text-muted">{service.desc}</p>
                  <button
                    className="btn btn-outline-dark mt-3 px-4 py-2 rounded-pill shadow-sm"
                    onClick={() =>
                      navigate(
                        `/service/${service.title
                          .toLowerCase()
                          .replace(/\s/g, "-")}`
                      )
                    }
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 text-center bg-gradient-light">
        <div className="container">
          <h2 className="fw-bold text-primary mb-4">How It Works</h2>
          <p className="lead mb-5 text-muted">
            Book any of our services quickly and effortlessly using our
            easy-to-use platform.
          </p>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[
              {
                step: "Choose a Service",
                desc: "Select the service you need from our wide range.",
                icon: "fa-search",
                bgColor: "bg-info",
                iconColor: "text-white",
              },
              {
                step: "Select a Time",
                desc: "Choose the time slot that suits your schedule.",
                icon: "fa-calendar-check",
                bgColor: "bg-success",
                iconColor: "text-white",
              },
              {
                step: "Confirm & Book",
                desc: "Confirm your booking and you are all set!",
                icon: "fa-check-circle",
                bgColor: "bg-danger",
                iconColor: "text-white",
              },
            ].map((step, index) => (
              <div className="col" key={index}>
                <div
                  className={`how-it-works-box ${step.bgColor} text-white mb-4`}
                >
                  <i
                    className={`fa ${step.icon} fa-3x mb-3 ${step.iconColor}`}
                  ></i>
                  <h3 className="mb-3">{step.step}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 text-center bg-dark text-white">
        <div className="container">
          <h2 className="fw-bold mb-4">Get In Touch</h2>
          <p className="lead mb-5">
            Have questions or need assistance? We're here to help!
          </p>
          <button
            className="btn btn-light btn-lg mt-3 px-4 py-2 rounded-pill shadow-lg"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicePage;
