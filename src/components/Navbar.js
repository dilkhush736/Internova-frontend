import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/internships?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <nav className="navbar navbar-expand-lg internova-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand internova-brand d-flex align-items-center gap-2" to="/dashboard">
          <div className="internova-logo-circle">I</div>
          <div>
            <span className="brand-main">Internova</span>
            <span className="brand-sub d-block">Internship Platform</span>
          </div>
        </Link>

        <button
          className="navbar-toggler internova-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#internovaNavbar"
          aria-controls="internovaNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="internovaNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link internova-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link internova-link" to="/internships">
                Internships
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link internova-link" to="/my-purchases">
                My Purchases
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link internova-link" to="/verify">
                Verify
              </Link>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
            <form className="internova-search-wrap" onSubmit={handleSearch}>
              <input
                type="text"
                className="internova-search"
                placeholder="Search internships..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="internova-search-btn">
                Search
              </button>
            </form>

            {token ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="internova-user-pill">
                  {user?.name || "User"}
                </span>
                <button className="btn internova-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/" className="btn internova-auth-btn">
                  Login
                </Link>
                <Link to="/register" className="btn internova-auth-outline-btn">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;