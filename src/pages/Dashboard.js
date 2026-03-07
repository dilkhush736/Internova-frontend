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
      <div className="card shadow p-4">
        <h2>Welcome, {user?.name || "User"} 🎉</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>

        <div className="d-flex gap-2 mt-3">
          <Link to="/internships" className="btn btn-dark">
            Explore Internships
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;