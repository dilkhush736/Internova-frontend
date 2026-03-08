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

      <div className="card shadow border-0 rounded-4 overflow-hidden mb-4">
        <div className="bg-dark text-white p-4">
          <h2 className="mb-1">Internova Certificate Verification</h2>
          <p className="mb-0 text-light">
            Verify authenticity using the certificate ID or QR-linked page.
          </p>
        </div>

        <div className="p-4">
          <div className="row g-2">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter Certificate ID"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-dark btn-lg w-100"
                onClick={() => handleVerify()}
                disabled={loading}
              >
                {loading ? "Checking..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {searched && result && (
        <div className="card shadow-sm border-0 rounded-4 p-4">
          {result.verified ? (
            <>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                <div>
                  <span className="badge bg-success fs-6 px-3 py-2">
                    VERIFIED
                  </span>
                </div>
                <div className="text-success fw-bold fs-5">
                  Authentic Internova Certificate
                </div>
              </div>

              <div className="alert alert-success border-0 rounded-3">
                Certificate is valid and has been successfully verified.
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
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
                    <p className="mb-0">
                      <strong>Status:</strong> {result.certificate?.status}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
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
                    <p className="mb-0">
                      <strong>Issued At:</strong>{" "}
                      {new Date(result.certificate?.issuedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                <div>
                  <span className="badge bg-danger fs-6 px-3 py-2">
                    INVALID
                  </span>
                </div>
                <div className="text-danger fw-bold fs-5">
                  Verification Failed
                </div>
              </div>

              <div className="alert alert-danger border-0 rounded-3 mb-0">
                {result.message || "Invalid certificate. Verification failed."}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyCertificate;