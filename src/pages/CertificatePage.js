import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function CertificatePage() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [eligibility, setEligibility] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchEligibility = async () => {
    try {
      const { data } = await API.get(`/certificates/eligibility/${internshipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEligibility(data);
    } catch (error) {
      console.error("Eligibility error:", error);
      alert(error.response?.data?.message || "Failed to check eligibility");
      navigate("/my-purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibility();
  }, [internshipId]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const { data } = await API.post(
        `/certificates/generate/${internshipId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCertificate(data.certificate);
      alert("Certificate generated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to generate certificate");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/certificates/${certificate.certificateId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download certificate");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Certificate download failed");
    }
  };

  if (loading) {
    return <div className="container py-5">Checking eligibility...</div>;
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow-sm p-4">
        <h2 className="mb-3">Final Certificate</h2>

        {eligibility?.eligible ? (
          <>
            <div className="alert alert-success">
              You are eligible for certificate generation.
            </div>

            {eligibility?.progress && (
              <div className="mb-3">
                <p className="mb-1">
                  <strong>Progress:</strong> {eligibility.progress.progressPercent}%
                </p>
                <p className="mb-1">
                  <strong>Test Passed:</strong> {eligibility.progress.testPassed ? "Yes" : "No"}
                </p>
                <p className="mb-0">
                  <strong>Final Eligible:</strong> {eligibility.progress.finalEligible ? "Yes" : "No"}
                </p>
              </div>
            )}

            {!certificate ? (
  <button
    className="btn btn-dark"
    onClick={handleGenerate}
    disabled={generating}
  >
    {generating ? "Generating..." : "Generate Certificate"}
  </button>
) : (
  <div className="mt-3">
    <div className="alert alert-info">
      <p className="mb-1">
        <strong>Certificate ID:</strong> {certificate.certificateId}
      </p>
      <p className="mb-0">
        <strong>Issued At:</strong>{" "}
        {new Date(certificate.issuedAt).toLocaleString()}
      </p>
    </div>

    <div className="d-flex gap-2 flex-wrap">
      <button className="btn btn-success" onClick={handleDownload}>
        Download Certificate
      </button>

      <button
        className="btn btn-outline-dark"
        onClick={() => navigate(`/verify/${certificate.certificateId}`)}
      >
        Verify Certificate
      </button>
    </div>
  </div>
)}

export default CertificatePage;