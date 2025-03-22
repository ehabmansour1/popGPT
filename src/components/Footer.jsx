import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <div className="logo">PopGPT</div>
          <p>Advanced AI chat platform with multiple model support.</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#">Home</a>
            <a href="#features">Features</a>
            <a href="#models">Models</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 PopGPT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
