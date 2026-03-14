import React from "react";

function UnlockTimeline({ modules, completedDays }) {
  return (
    <div className="unlock-timeline-card premium-timeline-card">
      <div className="course-section-head">
        <p className="section-kicker">Module Release Plan</p>
        <h3>Unlock Schedule</h3>
        <p>Modules unlock based on your internship day progress.</p>
      </div>

      <div className="unlock-timeline-list premium-timeline-list">
        {modules.map((module) => {
          const unlocked = module.isUnlocked;
          const remainingDays = Math.max(0, module.unlockDay - completedDays);

          return (
            <div
              key={module.id}
              className={`unlock-timeline-item premium-timeline-item ${
                unlocked ? "unlocked" : "locked"
              }`}
            >
              <div className="unlock-timeline-line" />
              <div className="unlock-timeline-dot" />

              <div className="unlock-timeline-content">
                <h4>{module.title}</h4>
                <p>{module.description}</p>

                <span className="unlock-timeline-status">
                  {unlocked
                    ? `Unlocked on Day ${module.unlockDay}`
                    : `Unlocks on Day ${module.unlockDay} • ${remainingDays} day(s) remaining`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UnlockTimeline;