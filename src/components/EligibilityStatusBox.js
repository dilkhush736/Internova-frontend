import React from "react";

function EligibilityStatusBox({ eligibility, requiredProgress }) {
  if (!eligibility) return null;

  return (
    <div className="eligibility-status-box premium-eligibility-card">
      <div className="eligibility-header">
        <div>
          <p className="section-kicker">Certificate Readiness</p>
          <h3>Certificate Eligibility Status</h3>
        </div>

        <span
          className={`eligibility-main-badge ${
            eligibility.eligible ? "success" : "pending"
          }`}
        >
          {eligibility.eligible ? "Eligible" : "In Progress"}
        </span>
      </div>

      <div className="eligibility-check-list">
        <div className="eligibility-item premium-eligibility-item">
          <span>Minimum Progress Required ({requiredProgress}%)</span>
          <strong>
            {eligibility.progressCompleted ? "✅ Completed" : "❌ Pending"}
          </strong>
        </div>

        <div className="eligibility-item premium-eligibility-item">
          <span>Mini Test Passed</span>
          <strong>
            {eligibility.miniTestCompleted ? "✅ Passed" : "❌ Not Passed"}
          </strong>
        </div>

        <div className="eligibility-item premium-eligibility-item">
          <span>Duration Completed</span>
          <strong>
            {eligibility.durationCompleted ? "✅ Completed" : "❌ Pending"}
          </strong>
        </div>
      </div>

      <p className="eligibility-final-status">
        {eligibility.eligible
          ? "You are now eligible for certificate generation."
          : "You are not eligible yet. Complete all required conditions first."}
      </p>
    </div>
  );
}

export default EligibilityStatusBox;