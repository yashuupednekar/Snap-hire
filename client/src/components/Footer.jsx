import React from "react";
import "../assets/style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              We are a dedicated team providing solutions to help you grow your
              business.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <ul className="social-links">
              <li>
                <a href="#" className="facebook">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="twitter">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="linkedin">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="instagram">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; 2025 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
