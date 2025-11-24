import React from "react";
import Navbar from "../components/Navbar";
import TeamImage1 from "../assets/images/team1.jpg";
import TeamImage2 from "../assets/images/team2.jpg";
import TeamImage3 from "../assets/images/team3.jpg";
import "../assets/style/AboutUs.css";
import HeroImg from "../assets/images/aboutus.jpg";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div>
      <Navbar />

      <header
        className="about-hero d-flex justify-content-center align-items-center text-center text-dark vh-100"
        style={{
          background: `url(${HeroImg}) no-repeat top center`,
          backgroundSize: "cover",
        }}
      >
        <div className="container1">
          <h1 className="fw-bold">About Us</h1>
          <p className="lead text-white">
          Learn more about our mission, vision, and the team dedicated to <br/>
providing exceptional photography services and capturing your perfect moments.

          </p>
        </div>
      </header>

      {/* Our Story Section */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold text-black mb-4">Our Story</h2>
          <p className="lead mb-5 text-muted">
          Our journey started with the goal of making professional photography accessible, 
convenient, and seamless for everyone. With the power of technology, we connect clients 
with skilled photographers, ensuring every special moment is beautifully captured.
We believe that every special moment—whether it’s a wedding, a milestone celebration, a corporate event, or a personal photoshoot—deserves to be captured with artistry and precision. Photography is more than just taking pictures; it’s about preserving emotions, telling stories, and creating memories that last a lifetime.

With the power of technology, we have transformed the way people connect with skilled photographers. Our platform bridges the gap between clients and talented professionals, ensuring that finding the right photographer is effortless, booking is stress-free, and the experience is truly enjoyable.


          </p>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-5 bg-gradient-to-r from-primary to-light text-center">
        <div className="container">
          <h2 className="fw-bold text-dark mb-4">Meet Our Team</h2>
          <p className="lead text-dark mb-5">
          The team works tirelessly to ensure your photography needs are met with creativity and professionalism.  

          </p>

          <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
            {[
              { name: "Oliviya Tylor", role: "Potrait Photographer", img: TeamImage1 },
              { name: "Jane Smith", role: "Product Photographer", img: TeamImage2 },
              { name: "shaun Johnson", role: "Film production", img: TeamImage3 },
            ].map((member, index) => (
              <div className="col mb-4" key={index}>
                <div className="card border-0 bg-transparent text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="card-img-top mb-3"
                    style={{
                      height: "200px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-dark mb-2">
                      {member.name}
                    </h5>
                    <p className="card-text text-dark">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h2 className="fw-bold text-Black mb-4">Our Vision</h2>
          <p className="lead mb-5 text-muted">
          We aim to be the leading platform for photography bookings, providing users with a seamless, secure,  
and efficient way to connect with professional photographers. Our vision is to make high-quality  
photography accessible to all and help clients capture their most cherished moments.  

          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
