import React from "react";

function MiniTestActionCard({
  progress,
  requiredProgress,
  miniTestPassed,
  onOpenMiniTest,
}) {
  const isUnlocked = progress >= requiredProgress;

  return (
    <div className="course-action-card">
      <div className="course-action-top">
        <div>
          <p className="course-action-label">Mini Test</p>
          <h3>
            {miniTestPassed
              ? "Mini Test Passed"
              : isUnlocked
              ? "Mini Test Available"
              : "Mini Test Locked"}
          </h3>
        </div>

        <span
          className={`course-action-badge ${
            miniTestPassed ? "success" : isUnlocked ? "info" : "warning"
          }`}
        >
          {miniTestPassed ? "Passed" : isUnlocked ? "Unlocked" : "Locked"}
        </span>
      </div>

      <p className="course-action-text">
        {miniTestPassed
          ? "Great work. You have already passed the mini test."
          : isUnlocked
          ? "You have completed the required learning progress. You can now take the mini test."
          : `Complete at least ${requiredProgress}% course progress to unlock the mini test.`}
      </p>

      <button
        type="button"
        className={`course-action-btn ${isUnlocked ? "primary" : "disabled"}`}
        disabled={!isUnlocked}
        onClick={isUnlocked ? onOpenMiniTest : undefined}
      >
        {miniTestPassed ? "View Result" : "Open Mini Test"}
      </button>
    </div>
  );
}

export default MiniTestActionCard;