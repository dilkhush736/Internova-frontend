import React from "react";

function VideoPlayerSection({
  selectedModule,
  selectedVideo,
  onPreviousVideo,
  onNextVideo,
  onMarkDemoProgress,
  onVideoEnded,
  hasPreviousVideo,
  hasNextVideo,
}) {
  if (!selectedModule || !selectedVideo) {
    return (
      <div className="video-player-card premium-video-card empty">
        <div className="video-empty-icon">▶</div>
        <h3>No video selected</h3>
        <p>
          Please choose an unlocked topic from the module list to start your
          learning session.
        </p>
      </div>
    );
  }

  return (
    <div className="video-player-card premium-video-card">
      <div className="video-player-header premium-video-header">
        <div>
          <p className="video-player-module">{selectedModule.title}</p>
          <h3>{selectedVideo.title}</h3>
          <span>{selectedVideo.description}</span>
        </div>

        <div className="video-player-status premium-video-status">
          <span>{selectedVideo.duration}</span>
          <strong>
            {selectedVideo.completed
              ? "Completed"
              : `${selectedVideo.watchedPercent || 0}% Watched`}
          </strong>
        </div>
      </div>

      <div className="video-player-wrapper premium-video-wrapper">
        <video
          key={selectedVideo.id}
          controls
          className="internova-video-player"
          src={selectedVideo.videoUrl}
          onEnded={onVideoEnded}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-player-controls-note premium-chip-row">
        <div className="player-feature-chip">Play / Pause</div>
        <div className="player-feature-chip">Replay</div>
        <div className="player-feature-chip">Speed Control</div>
        <div className="player-feature-chip">Quality Switch</div>
        <div className="player-feature-chip">Fullscreen</div>
        <div className="player-feature-chip">
          {hasNextVideo ? "Autoplay Next Ready" : "Last Video"}
        </div>
      </div>

      <div className="video-demo-progress-row">
        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => onMarkDemoProgress(25)}
        >
          Mark 25%
        </button>

        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => onMarkDemoProgress(50)}
        >
          Mark 50%
        </button>

        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => onMarkDemoProgress(80)}
        >
          Mark 80%
        </button>

        <button
          type="button"
          className="demo-progress-btn primary elite-focus-ring"
          onClick={() => onMarkDemoProgress(100)}
        >
          Mark 100%
        </button>
      </div>

      <div className="video-player-actions premium-video-actions">
        <button
          type="button"
          className={`video-nav-btn elite-focus-ring ${
            !hasPreviousVideo ? "disabled" : ""
          }`}
          onClick={onPreviousVideo}
          disabled={!hasPreviousVideo}
        >
          Previous Video
        </button>

        <button
          type="button"
          className={`video-nav-btn primary elite-focus-ring ${
            !hasNextVideo ? "disabled" : ""
          }`}
          onClick={onNextVideo}
          disabled={!hasNextVideo}
        >
          Next Video
        </button>
      </div>

      <div className="video-learning-info-grid">
        <div className="video-info-card premium-info-card">
          <h4>Topic Summary</h4>
          <p>
            {selectedVideo.description} This section should help the learner
            understand the main idea before moving to the next topic.
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Learning Goal</h4>
          <p>
            Complete at least 80% watch progress on this topic so it can count
            toward course completion and certificate eligibility.
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Resources</h4>
          <ul>
            <li>Topic notes PDF</li>
            <li>Practice examples</li>
            <li>Quick revision points</li>
          </ul>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Smart Progress Rule</h4>
          <p>
            In final backend version, progress will update automatically from
            real watch time instead of demo buttons.
          </p>
        </div>
      </div>

      <div className="video-player-feature-note premium-feature-note">
        <p>
          Demo progress buttons are temporary. Next backend phase me real watch
          tracking, resume position, autoplay next, speed memory and secure
          completion logic add kiya jayega.
        </p>
      </div>
    </div>
  );
}

export default VideoPlayerSection;