import React from "react";

function ContinueLearningCard({
  selectedModule,
  selectedVideo,
  nextVideoLabel,
  overallProgress,
}) {
  if (!selectedModule || !selectedVideo) return null;

  return (
    <div className="continue-learning-card premium-continue-card">
      <div className="continue-learning-top">
        <div>
          <p className="continue-learning-label">Continue Learning</p>
          <h3>{selectedVideo.title}</h3>
          <span>{selectedModule.title}</span>
        </div>

        <div className="continue-learning-progress">
          <strong>{overallProgress}%</strong>
          <small>Overall Progress</small>
        </div>
      </div>

      <div className="continue-learning-meta">
        <div className="continue-meta-box premium-continue-box">
          <span>Current Watch</span>
          <strong>{selectedVideo.watchedPercent || 0}%</strong>
        </div>

        <div className="continue-meta-box premium-continue-box">
          <span>Duration</span>
          <strong>{selectedVideo.duration}</strong>
        </div>

        <div className="continue-meta-box premium-continue-box">
          <span>Up Next</span>
          <strong>{nextVideoLabel || "No next video"}</strong>
        </div>
      </div>
    </div>
  );
}

export default ContinueLearningCard;