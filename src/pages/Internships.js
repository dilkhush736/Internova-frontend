import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="bg-dark text-white p-4">
          <h2 className="mb-1">Welcome to Internova</h2>
          <p className="mb-0 text-light">
            Track your internships, progress, tests, and certificates in one place.
          </p>
        </div>

        <div className="p-4">
          <div className="row g-4 align-items-center">
            <div className="col-md-8">
              <h3 className="mb-3">Hello, {user?.name || "User"} 👋</h3>
              <p className="mb-2">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="mb-0">
                <strong>Role:</strong> {user?.role}
              </p>
            </div>

            <div className="col-md-4">
              <div className="border rounded-4 p-3 bg-light h-100">
                <h5 className="mb-3">Quick Actions</h5>

                <div className="d-grid gap-2">
                  <Link to="/internships" className="btn btn-dark">
                    Explore Internships
                  </Link>

                  <Link to="/my-purchases" className="btn btn-success">
                    My Purchases
                  </Link>

                  <Link to="/verify" className="btn btn-outline-dark">
                    Verify Certificate
                  </Link>

                  <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="border rounded-4 p-4 h-100 bg-light">
                <h5>Internships</h5>
                <p className="text-muted mb-0">
                  Browse domain-based internship programs with multiple durations.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="border rounded-4 p-4 h-100 bg-light">
                <h5>Learning Progress</h5>
                <p className="text-muted mb-0">
                  Complete modules, track progress, and unlock certificate eligibility.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="border rounded-4 p-4 h-100 bg-light">
                <h5>Certificates</h5>
                <p className="text-muted mb-0">
                  Generate, download, and verify official Internova certificates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;