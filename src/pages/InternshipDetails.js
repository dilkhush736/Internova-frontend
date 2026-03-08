import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const [certificateEligible, setCertificateEligible] = useState(false);
  const [certificateExists, setCertificateExists] = useState(false);
  const [checkingCertificate, setCheckingCertificate] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchInternship = async () => {
    try {
      const { data } = await API.get(`/internships/${id}`);
      setInternship(data.internship);

      if (data.internship?.durations?.length > 0) {
        setSelectedDuration(data.internship.durations[0].label);
      }
    } catch (error) {
      console.error("Failed to fetch internship details:", error);
      alert("Failed to load internship details");
    }
  };

  const checkCertificateEligibility = async () => {
    try {
      setCheckingCertificate(true);

      if (!token) {
        setCertificateEligible(false);
        setCertificateExists(false);
        return;
      }

      const { data } = await API.get(`/certificates/eligibility/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCertificateEligible(!!data.eligible);
        setCertificateExists(!!data.certificateExists);
      } else {
        setCertificateEligible(false);
        setCertificateExists(false);
      }
    } catch (error) {
      console.error("Eligibility check failed:", error);
      setCertificateEligible(false);
      setCertificateExists(false);
    } finally {
      setCheckingCertificate(false);
    }
  };

  useEffect(() => {
    fetchInternship();
    checkCertificateEligibility();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      if (!token) {
        alert("Please login first");
        navigate("/");
        return;
      }

      setLoading(true);

      const { data } = await API.post(
        "/payments/create-order",
        {
          internshipId: id,
          durationLabel: selectedDuration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Internova",
        description: `Internova - ${data.internship.title} (${data.duration.label})`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await API.post(
              "/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              alert("Payment successful!");
              await checkCertificateEligibility();
              navigate("/my-purchases");
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#111111",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment start error:", error);
      alert(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      if (!token) {
        alert("Please login first");
        navigate("/");
        return;
      }

      setLoading(true);

      const { data } = await API.post(
        `/certificates/generate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        alert(data.message || "Certificate generated successfully");

        if (data.certificate?.certificateId) {
          window.open(
            `http://localhost:5000/api/certificates/${data.certificate.certificateId}/download`,
            "_blank"
          );
        }

        await checkCertificateEligibility();
      } else {
        alert("Certificate generation failed");
      }
    } catch (error) {
      console.error("Certificate generate error:", error);
      alert(error.response?.data?.message || "Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  if (!internship) {
    return <div className="container py-5">Loading details...</div>;
  }

  const selectedPlan = internship.durations.find(
    (item) => item.label === selectedDuration
  );

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-dark mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card border-0 shadow rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-6">
            <img
              src={internship.thumbnail || "https://via.placeholder.com/600x350"}
              alt={internship.title}
              className="img-fluid w-100 h-100"
              style={{ objectFit: "cover", minHeight: "100%" }}
            />
          </div>

          <div className="col-lg-6">
            <div className="p-4 p-lg-5">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h2 className="mb-1">{internship.title}</h2>
                  <span className="badge bg-secondary">{internship.branch}</span>
                </div>

                <span className="badge bg-dark">{internship.category}</span>
              </div>

              <p className="text-muted mb-4">{internship.description}</p>

              <div className="border rounded-4 p-3 bg-light mb-4">
                <label className="form-label fw-bold mb-2">
                  Select Duration
                </label>
                <select
                  className="form-select"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  {internship.durations.map((item, index) => (
                    <option key={index} value={item.label}>
                      {item.label} - INR {item.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border rounded-4 p-3 mb-4">
                <h4 className="mb-2">Selected Plan</h4>
                <p className="mb-1">
                  <strong>Duration:</strong>{" "}
                  {selectedPlan ? selectedPlan.label : "N/A"}
                </p>
                <p className="mb-0">
                  <strong>Price:</strong> INR {selectedPlan ? selectedPlan.price : 0}
                </p>
              </div>

              {checkingCertificate ? (
                <div className="alert alert-secondary">
                  Checking certificate status...
                </div>
              ) : certificateEligible ? (
                <div className="alert alert-success">
                  You are eligible to claim your certificate for this internship.
                </div>
              ) : (
                <div className="alert alert-warning">
                  Complete the required course progress and mini test to become certificate-eligible.
                </div>
              )}

              <div className="d-grid gap-3">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleBuyNow}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Buy Now"}
                </button>

                {!checkingCertificate && certificateEligible && (
                  <button
                    className="btn btn-dark btn-lg"
                    onClick={handleGenerateCertificate}
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : certificateExists
                      ? "Download Certificate"
                      : "Generate Certificate"}
                  </button>
                )}
              </div>

              <div className="mt-4 border rounded-4 p-3 bg-light">
                <h5 className="mb-3">What you get</h5>
                <ul className="mb-0 ps-3">
                  <li>Internship access after successful payment</li>
                  <li>Offer letter download</li>
                  <li>Course modules and progress tracking</li>
                  <li>Mini test and retake support</li>
                  <li>Certificate generation after eligibility</li>
                  <li>Public certificate verification via ID / QR</li>
                </ul>
              </div>

              <p className="text-muted small mt-3 mb-0">
                After successful payment, this internship will appear in My Purchases,
                where you can access the course, offer letter, mini test, and certificate flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;