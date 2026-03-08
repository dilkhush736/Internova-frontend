import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function VerifyCertificate() {
  const { certificateId: routeCertificateId } = useParams();
  const navigate = useNavigate();

  const [certificateId, setCertificateId] = useState(routeCertificateId || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (customId) => {
    const idToCheck = customId || certificateId;

    if (!idToCheck.trim()) {
      alert("Please enter a certificate ID");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const { data } = await API.get(`/certificates/verify/${idToCheck}`);

      setResult(data);
    } catch (error) {
      console.error("Verification failed:", error);
      setResult({
        success: false,
        verified: false,
        message:
          error.response?.data?.message || "Certificate verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeCertificateId) {
      handleVerify(routeCertificateId);
    }
  }, [routeCertificateId]);

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow-sm p-4 mb-4">
        <h2 className="mb-3">Verify Certificate</h2>
        <p className="text-muted">
          Enter the certificate ID below to check whether the certificate is valid.
        </p>

        <div className="row g-2">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-dark w-100"
              onClick={() => handleVerify()}
              disabled={loading}
            >
              {loading ? "Checking..." : "Verify"}
            </button>
          </div>
        </div>
      </div>

      {searched && result && (
        <div className="card shadow-sm p-4">
          {result.verified ? (
            <>
              <div className="alert alert-success">
                Certificate is valid and verified successfully.
              </div>

              <h4 className="mb-3">Verification Details</h4>

              <p className="mb-2">
                <strong>Certificate ID:</strong>{" "}
                {result.certificate?.certificateId}
              </p>
              <p className="mb-2">
                <strong>Candidate Name:</strong>{" "}
                {result.certificate?.candidateName}
              </p>
              <p className="mb-2">
                <strong>Candidate Email:</strong>{" "}
                {result.certificate?.candidateEmail}
              </p>
              <p className="mb-2">
                <strong>Internship Title:</strong>{" "}
                {result.certificate?.internshipTitle}
              </p>
              <p className="mb-2">
                <strong>Branch:</strong> {result.certificate?.branch}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {result.certificate?.category}
              </p>
              <p className="mb-2">
                <strong>Issued At:</strong>{" "}
                {new Date(result.certificate?.issuedAt).toLocaleString()}
              </p>
              <p className="mb-0">
                <strong>Status:</strong> {result.certificate?.status}
              </p>
            </>
          ) : (
            <div className="alert alert-danger mb-0">
              {result.message || "Invalid certificate. Verification failed."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyCertificate;