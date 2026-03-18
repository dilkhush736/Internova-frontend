import React from "react";

function UnlockAllModulesCard({
  lockedModules,
  unlockAllPurchased,
  onUnlockAllModules,
  loading = false,
  price = 99,
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
          Premium unlock-all access is active for this internship. You can now
          continue through all course modules without waiting for scheduled day
          locks. Certificate duration rules still apply.
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
          <h3>Instant Access for ₹{price}</h3>
        </div>

        <span className="course-action-badge info">Addon</span>
      </div>

      <p className="course-action-text">
        Get verified premium access to all currently locked modules through a
        real payment flow. This unlocks learning content early, but certificate
        eligibility will still depend on required progress, mini test, and
        internship duration completion.
      </p>

      <button
        type="button"
        className={`course-action-btn ${
          lockedModules > 0 && !loading ? "primary" : "disabled"
        }`}
        disabled={lockedModules === 0 || loading}
        onClick={lockedModules > 0 && !loading ? onUnlockAllModules : undefined}
      >
        {loading
          ? "Opening Payment..."
          : lockedModules > 0
          ? `Unlock All for ₹${price}`
          : "No Locked Modules"}
      </button>
    </div>
  );
}

export default UnlockAllModulesCard;