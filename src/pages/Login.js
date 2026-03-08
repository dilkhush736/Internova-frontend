import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-lg-10">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="row g-0">
              <div className="col-md-6 bg-dark text-white d-flex flex-column justify-content-center p-5">
                <h1 className="mb-3">Internova</h1>
                <h3 className="mb-3">Welcome Back</h3>
                <p className="text-light mb-0">
                  Access your internship dashboard, course progress, mini tests,
                  offer letters, certificates, and verification tools in one place.
                </p>
              </div>

              <div className="col-md-6 bg-white">
                <div className="p-4 p-lg-5">
                  <h2 className="mb-4 text-center">Login</h2>

                  {message && (
                    <div
                      className={`alert ${
                        message.toLowerCase().includes("successful")
                          ? "alert-success"
                          : "alert-danger"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="form-control form-control-lg"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      className="btn btn-dark btn-lg w-100"
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Login"}
                    </button>
                  </form>

                  <p className="text-center mt-4 mb-0">
                    Don’t have an account?{" "}
                    <Link to="/register" className="fw-semibold text-decoration-none">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;