import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInternships = async () => {
    try {
      const { data } = await API.get("/internships");
      setInternships(data.internships || []);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  if (loading) {
    return <div className="container py-5">Loading internships...</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Available Internship Programs</h2>

      <div className="row">
        {internships.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={item.thumbnail || "https://via.placeholder.com/400x250"}
                className="card-img-top"
                alt={item.title}
                style={{ height: "220px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="mb-1">
                  <strong>Branch:</strong> {item.branch}
                </p>
                <p className="mb-1">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="text-muted">
                  {item.description.slice(0, 90)}...
                </p>
              </div>
              <div className="card-footer bg-white border-0 pb-3">
                <Link
                  to={`/internships/${item._id}`}
                  className="btn btn-dark w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Internships;