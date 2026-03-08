import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="internova-footer mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="internova-logo-circle footer-logo">I</div>
              <div>
                <h4 className="mb-0 text-white">Internova</h4>
                <small className="text-light-emphasis">Internship Platform</small>
              </div>
            </div>
            <p className="footer-text">
              Internova helps learners explore internships, track progress,
              complete assessments, generate certificates, and verify credentials
              through a premium digital experience.
            </p>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/internships">Internships</Link></li>
              <li><Link to="/my-purchases">My Purchases</Link></li>
              <li><Link to="/verify">Verify Certificate</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-4">
            <h5 className="footer-heading">Programs</h5>
            <ul className="footer-links">
              <li><span>Web Development</span></li>
              <li><span>AI & ML</span></li>
              <li><span>Digital Marketing</span></li>
              <li><span>Business Analytics</span></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-4">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li><span>Email: support@internova.com</span></li>
              <li><span>Hours: Mon - Sat</span></li>
              <li><span>Certificate Verification</span></li>
              <li><span>Secure Learning Access</span></li>
            </ul>
          </div>
        </div>

        <div className="internova-footer-bottom mt-4 pt-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <p className="mb-0 footer-copy">
              © 2026 Internova. All rights reserved.
            </p>

            <div className="footer-socials">
              <a href="/" onClick={(e) => e.preventDefault()}>LinkedIn</a>
              <a href="/" onClick={(e) => e.preventDefault()}>GitHub</a>
              <a href="/" onClick={(e) => e.preventDefault()}>Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;