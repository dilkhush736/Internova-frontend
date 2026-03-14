import React from "react";

function CertificateActionCard({ eligibility, onOpenCertificate }) {
  if (!eligibility) return null;

  return (
    <div className="course-action-card">
      <div className="course-action-top">
        <div>
          <p className="course-action-label">Final Certificate</p>
          <h3>
            {eligibility.eligible
              ? "Certificate Eligible"
              : "Certificate Locked"}
          </h3>
        </div>

        <span
          className={`course-action-badge ${
            eligibility.eligible ? "success" : "warning"
          }`}
        >
          {eligibility.eligible ? "Eligible" : "Locked"}
        </span>
      </div>

      <p className="course-action-text">
        {eligibility.eligible
          ? "You have completed all required conditions. You can now generate your final certificate."
          : "Certificate will unlock only after required progress, mini test pass, and selected duration completion."}
      </p>

      <button
        type="button"
        className={`course-action-btn ${
          eligibility.eligible ? "primary" : "disabled"
        }`}
        disabled={!eligibility.eligible}
        onClick={eligibility.eligible ? onOpenCertificate : undefined}
      >
        {eligibility.eligible ? "Generate Certificate" : "Certificate Locked"}
      </button>
    </div>
  );
}

export default CertificateActionCard;