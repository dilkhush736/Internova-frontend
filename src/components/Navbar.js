import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaLayerGroup,
  FaClipboardCheck,
  FaShieldAlt,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaInfoCircle,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";
import { HiMiniBars3BottomRight } from "react-icons/hi2";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingVerificationEmail");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/internships?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/internships") return location.pathname.startsWith("/internships");
    if (path === "/my-purchases") return location.pathname.startsWith("/my-purchases");
    if (path === "/verify") return location.pathname.startsWith("/verify");
    if (path === "/about") return location.pathname === "/about";
    if (path === "/contact") return location.pathname === "/contact";
    return false;
  };

  return (
    <>
      <style>{`
        .internovatech-navbar {
          background: rgba(255, 255, 255, 0.80);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.92);
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
          padding-top: 10px;
          padding-bottom: 10px;
          z-index: 1100;
        }

        .internovatech-navbar .container {
          max-width: 1360px;
        }

        .internovatech-navbar-shell {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .internovatech-brand {
          text-decoration: none;
          min-width: 0;
          flex-shrink: 0;
          margin-right: 6px;
          transition: all 0.3s ease;
        }

        .internovatech-brand:hover {
          transform: translateY(-1px);
        }

        .internovatech-brand-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .internovatech-logo-circle {
          width: 46px;
          height: 46px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0b1736 0%, #142850 45%, #1d4ed8 100%);
          color: #fff;
          font-weight: 800;
          font-size: 1.05rem;
          box-shadow:
            0 14px 28px rgba(29, 78, 216, 0.22),
            0 6px 14px rgba(11, 23, 54, 0.18);
          flex-shrink: 0;
        }

        .internovatech-brand-text {
          min-width: 0;
          line-height: 1;
        }

        .brand-main {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.03;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .brand-sub {
          font-size: 0.72rem;
          color: #64748b;
          line-height: 1.2;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .internovatech-toggler {
          border: 1px solid #dbe3f0;
          border-radius: 14px;
          padding: 9px 11px;
          box-shadow: none !important;
          background: rgba(255,255,255,0.96);
          transition: all 0.25s ease;
          flex-shrink: 0;
          margin-left: auto;
        }

        .internovatech-toggler:hover {
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .internovatech-toggler:focus {
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
        }

        .internovatech-toggler-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-size: 1.15rem;
          line-height: 1;
        }

        .navbar-collapse {
          min-width: 0;
          flex: 1;
        }

        .internovatech-navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
          width: 100%;
        }

        .internovatech-nav-list {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
          flex-wrap: nowrap;
          margin-right: 0;
          flex-shrink: 1;
        }

        .internovatech-link {
          position: relative;
          color: #475569 !important;
          font-weight: 700;
          padding: 9px 12px !important;
          border-radius: 14px;
          transition: all 0.28s ease;
          white-space: nowrap;
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          font-size: 0.98rem;
        }

        .internovatech-link:hover {
          color: #0f172a !important;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .internovatech-link.active {
          color: #0f172a !important;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          box-shadow: inset 0 0 0 1px #dbeafe;
        }

        .internovatech-nav-icon {
          font-size: 0.9rem;
          color: #2563eb;
          flex-shrink: 0;
          transition: all 0.28s ease;
        }

        .internovatech-link:hover .internovatech-nav-icon,
        .internovatech-link.active .internovatech-nav-icon {
          color: #0f172a;
          transform: scale(1.06);
        }

        .internovatech-right-zone {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex-wrap: nowrap;
          margin-left: auto;
          flex-shrink: 1;
        }

        .internovatech-search-wrap {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #dbe3f0;
          border-radius: 18px;
          padding: 4px;
          min-height: 52px;
          width: 280px;
          max-width: 280px;
          min-width: 0;
          flex-shrink: 1;
          transition: all 0.3s ease;
        }

        .internovatech-search-wrap:focus-within {
          background: #ffffff;
          border-color: #60a5fa;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .internovatech-search {
          border: none;
          outline: none;
          background: transparent;
          padding: 0 12px;
          flex: 1;
          color: #0f172a;
          font-weight: 600;
          min-width: 0;
        }

        .internovatech-search::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .internovatech-search-btn {
          border: none;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 14px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
          transition: all 0.28s ease;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .internovatech-search-btn:hover {
          transform: translateY(-1px);
        }

        .internovatech-search-btn-icon {
          font-size: 0.9rem;
        }

        .internovatech-user-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex-shrink: 1;
        }

        .internovatech-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          max-width: 180px;
          min-width: 0;
          padding: 0 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #0f172a;
          font-weight: 800;
          border: 1px solid #dbeafe;
          overflow: hidden;
          flex-shrink: 1;
          transition: all 0.3s ease;
        }

        .internovatech-user-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.10);
        }

        .internovatech-user-icon {
          font-size: 0.98rem;
          color: #2563eb;
          flex-shrink: 0;
        }

        .internovatech-user-name {
          display: block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .internovatech-logout-btn,
        .internovatech-auth-btn,
        .internovatech-auth-outline-btn {
          min-height: 44px;
          padding: 0 16px;
          border-radius: 16px;
          font-weight: 800;
          transition: all 0.3s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .internovatech-logout-btn,
        .internovatech-auth-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
        }

        .internovatech-auth-outline-btn {
          border: 1px solid #dbe3f0;
          background: rgba(255,255,255,0.7);
          color: #0f172a;
          backdrop-filter: blur(8px);
        }

        .internovatech-logout-btn:hover,
        .internovatech-auth-btn:hover,
        .internovatech-auth-outline-btn:hover {
          transform: translateY(-2px);
        }

        .internovatech-btn-icon {
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        @media (min-width: 992px) {
          .internovatech-toggler {
            display: none !important;
          }

          .navbar-collapse {
            display: flex !important;
            flex-basis: auto;
          }
        }

        @media (max-width: 1399px) {
          .internovatech-search-wrap {
            width: 255px;
            max-width: 255px;
          }

          .internovatech-user-pill {
            max-width: 160px;
          }
        }

        @media (max-width: 1199px) {
          .internovatech-search-wrap {
            width: 220px;
            max-width: 220px;
          }

          .internovatech-user-pill {
            max-width: 145px;
          }

          .internovatech-link {
            padding: 9px 10px !important;
            font-size: 0.95rem;
          }

          .internovatech-navbar-content {
            gap: 10px;
          }

          .internovatech-nav-list {
            gap: 2px;
          }
        }

        @media (max-width: 991px) {
          .internovatech-navbar-shell {
            display: block;
          }

          .internovatech-navbar-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            width: 100%;
          }

          .navbar-collapse {
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            width: 100%;
          }

          .internovatech-navbar-content {
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
            width: 100%;
          }

          .internovatech-nav-list {
            width: 100%;
            flex-direction: column;
            align-items: stretch !important;
            gap: 8px;
          }

          .internovatech-link {
            width: 100%;
            justify-content: flex-start;
            padding: 12px 14px !important;
          }

          .internovatech-right-zone {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            margin-left: 0;
            gap: 12px;
          }

          .internovatech-search-wrap {
            width: 100%;
            max-width: 100%;
          }

          .internovatech-user-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .internovatech-user-pill,
          .internovatech-logout-btn,
          .internovatech-auth-btn,
          .internovatech-auth-outline-btn {
            width: 100%;
            max-width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 767px) {
          .brand-main {
            font-size: 0.98rem;
          }

          .brand-sub {
            font-size: 0.66rem;
          }

          .internovatech-logo-circle {
            width: 42px;
            height: 42px;
            border-radius: 14px;
          }

          .internovatech-brand-wrap {
            gap: 9px;
          }
        }

        @media (max-width: 575px) {
          .brand-main {
            font-size: 0.92rem;
          }

          .brand-sub {
            font-size: 0.60rem;
          }

          .internovatech-brand-wrap {
            gap: 8px;
          }

          .internovatech-logo-circle {
            width: 40px;
            height: 40px;
            border-radius: 13px;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg internovatech-navbar sticky-top">
        <div className="container">
          <div className="internovatech-navbar-shell w-100">
            <div className="internovatech-navbar-top">
              <Link className="navbar-brand internovatech-brand" to="/">
                <div className="internovatech-brand-wrap">
                  <div className="internovatech-logo-circle">I</div>
                  <div className="internovatech-brand-text">
                    <span className="brand-main">InternovaTech</span>
                    <span className="brand-sub d-block">Online Internships Platform</span>
                  </div>
                </div>
              </Link>

              <button
                className="navbar-toggler internovatech-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#internovatechNavbar"
                aria-controls="internovatechNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="internovatech-toggler-icon-wrap">
                  <HiMiniBars3BottomRight />
                </span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="internovatechNavbar">
              <div className="internovatech-navbar-content">
                <ul className="navbar-nav internovatech-nav-list mb-2 mb-lg-0 align-items-lg-center">
                  <li className="nav-item">
                    <Link
                      className={`nav-link internovatech-link ${isActive("/") ? "active" : ""}`}
                      to="/"
                    >
                      <FaHome className="internovatech-nav-icon" />
                      <span>Home</span>
                    </Link>
                  </li>

                  {token && (
                    <li className="nav-item">
                      <Link
                        className={`nav-link internovatech-link ${isActive("/dashboard") ? "active" : ""}`}
                        to="/dashboard"
                      >
                        <FaThLarge className="internovatech-nav-icon" />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <Link
                      className={`nav-link internovatech-link ${isActive("/internships") ? "active" : ""}`}
                      to="/internships"
                    >
                      <FaLayerGroup className="internovatech-nav-icon" />
                      <span>Programs</span>
                    </Link>
                  </li>

                  {token && (
                    <li className="nav-item">
                      <Link
                        className={`nav-link internovatech-link ${isActive("/my-purchases") ? "active" : ""}`}
                        to="/my-purchases"
                      >
                        <FaClipboardCheck className="internovatech-nav-icon" />
                        <span>My Enrollments</span>
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <Link
                      className={`nav-link internovatech-link ${isActive("/verify") ? "active" : ""}`}
                      to="/verify"
                    >
                      <FaShieldAlt className="internovatech-nav-icon" />
                      <span>Verify</span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`nav-link internovatech-link ${isActive("/about") ? "active" : ""}`}
                      to="/about"
                    >
                      <FaInfoCircle className="internovatech-nav-icon" />
                      <span>About</span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`nav-link internovatech-link ${isActive("/contact") ? "active" : ""}`}
                      to="/contact"
                    >
                      <FaEnvelope className="internovatech-nav-icon" />
                      <span>Contact</span>
                    </Link>
                  </li>
                </ul>

                <div className="internovatech-right-zone">
                  <form className="internovatech-search-wrap" onSubmit={handleSearch}>
                    <input
                      type="text"
                      className="internovatech-search"
                      placeholder="Search programs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="internovatech-search-btn">
                      <FaSearch className="internovatech-search-btn-icon" />
                      <span>Search</span>
                    </button>
                  </form>

                  {token ? (
                    <div className="internovatech-user-actions">
                      <span
                        className="internovatech-user-pill"
                        title={user?.name || "User"}
                      >
                        <FaUserCircle className="internovatech-user-icon" />
                        <span className="internovatech-user-name">
                          {user?.name || "User"}
                        </span>
                      </span>

                      <button
                        className="btn internovatech-logout-btn"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="internovatech-btn-icon" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2 flex-column flex-sm-row">
                      <Link to="/login" className="btn internovatech-auth-btn">
                        <FaSignInAlt className="internovatech-btn-icon" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        className="btn internovatech-auth-outline-btn"
                      >
                        <FaUserPlus className="internovatech-btn-icon" />
                        <span>Register</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;