import React from "react";

function UnlockAllModulesCard({
  lockedModules,
  unlockAllPurchased,
  onUnlockAllModules,
}) {
  if (unlockAllPurchased) {
    return (
      <div className="course-action-card premium-card">
        <div className="course-action-top">
          <div>
            <p className="course-action-label">Premium Access</p>
            <h3>All Modules Unlocked</h3>
          </div>

          <span className="course-action-badge success">Active</span>
        </div>

        <p className="course-action-text">
          You already have unlock-all access. You can watch all modules now.
          Certificate duration rules still apply.
        </p>

        <button type="button" className="course-action-btn disabled" disabled>
          Premium Active
        </button>
      </div>
    );
  }

  return (
    <div className="course-action-card premium-card">
      <div className="course-action-top">
        <div>
          <p className="course-action-label">Unlock All Modules</p>
          <h3>Instant Access for ₹99</h3>
        </div>

        <span className="course-action-badge info">Optional</span>
      </div>

      <p className="course-action-text">
        Get immediate access to all locked modules. This only unlocks learning
        content early. Certificate eligibility will still depend on required
        progress, mini test, and internship duration completion.
      </p>

      <button
        type="button"
        className={`course-action-btn ${
          lockedModules > 0 ? "primary" : "disabled"
        }`}
        disabled={lockedModules === 0}
        onClick={lockedModules > 0 ? onUnlockAllModules : undefined}
      >
        {lockedModules > 0 ? "Unlock All for ₹99" : "No Locked Modules"}
      </button>
    </div>
  );
}

export default UnlockAllModulesCard;