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
      <div className="course-action-card premium-card premium-card-active">
        <div className="course-action-top">
          <div>
            <p className="course-action-label">Premium Access</p>
            <h3>All Modules Unlocked</h3>
          </div>

          <span className="course-action-badge success">Active</span>
        </div>

        <p className="course-action-text">
          Your premium access is active. All scheduled locked modules are now
          available for learning. Certificate rules, progress requirement, mini
          test, and duration completion will still apply.
        </p>

        <div className="premium-benefit-list">
          <span>Full module access</span>
          <span>Continue without waiting</span>
          <span>Premium unlock verified</span>
        </div>

        <button type="button" className="course-action-btn disabled" disabled>
          Premium Active
        </button>
      </div>
    );
  }

  return (
    <div className="course-action-card premium-card premium-card-upgrade">
      <div className="course-action-top">
        <div>
          <p className="course-action-label">Premium Upgrade</p>
          <h3>Unlock All Modules for ₹{price}</h3>
        </div>

        <span className="course-action-badge info">Secure Payment</span>
      </div>

      <p className="course-action-text">
        Unlock all currently locked modules instantly through a verified payment.
        This is ideal for learners who want faster access without waiting for
        day-based release.
      </p>

      <div className="premium-benefit-list">
        <span>{lockedModules} modules still locked</span>
        <span>One-time addon payment</span>
        <span>Certificate rules unchanged</span>
      </div>

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