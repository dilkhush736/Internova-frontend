import React, { useEffect, useMemo, useRef, useState } from "react";

function VideoPlayerSection({
  selectedModule,
  selectedVideo,
  onPreviousVideo,
  onNextVideo,
  onTrackedProgress,
  onMarkDemoProgress,
  onVideoEnded,
  hasPreviousVideo,
  hasNextVideo,
}) {
  const videoRef = useRef(null);
  const sentMilestonesRef = useRef(new Set());

  const [localProgress, setLocalProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const milestoneSteps = useMemo(() => [10, 25, 50, 80, 100], []);

  useEffect(() => {
    setLocalProgress(selectedVideo?.watchedPercent || 0);
    setVideoDuration(0);
    sentMilestonesRef.current = new Set();

    const alreadyWatched = selectedVideo?.watchedPercent || 0;
    milestoneSteps.forEach((step) => {
      if (alreadyWatched >= step) {
        sentMilestonesRef.current.add(step);
      }
    });
  }, [selectedVideo, milestoneSteps]);

  const pushTrackedMilestone = (percent) => {
    if (!selectedVideo || !onTrackedProgress) return;

    if (!sentMilestonesRef.current.has(percent)) {
      sentMilestonesRef.current.add(percent);
      onTrackedProgress(percent);
    }
  };

  const handleLoadedMetadata = () => {
    const duration = videoRef.current?.duration || 0;
    setVideoDuration(duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    const watched = Math.min(
      100,
      Math.floor((video.currentTime / video.duration) * 100)
    );

    setLocalProgress(watched);

    milestoneSteps.forEach((step) => {
      if (watched >= step) {
        pushTrackedMilestone(step);
      }
    });
  };

  const handleEndedInternal = () => {
    setLocalProgress(100);
    pushTrackedMilestone(100);

    if (onVideoEnded) {
      onVideoEnded();
    }
  };

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
          <span>
            {selectedVideo.duration ||
              (videoDuration
                ? `${Math.floor(videoDuration / 60)}:${String(
                    Math.floor(videoDuration % 60)
                  ).padStart(2, "0")}`
                : "Video")}
          </span>
          <strong>
            {localProgress >= 80 ? "Completed" : `${localProgress}% Watched`}
          </strong>
        </div>
      </div>

      <div className="video-player-wrapper premium-video-wrapper">
        <video
          ref={videoRef}
          key={selectedVideo.id}
          controls
          className="internova-video-player"
          src={selectedVideo.videoUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEndedInternal}
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
          onClick={() => onMarkDemoProgress?.(25)}
        >
          Mark 25%
        </button>

        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => onMarkDemoProgress?.(50)}
        >
          Mark 50%
        </button>

        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => onMarkDemoProgress?.(80)}
        >
          Mark 80%
        </button>

        <button
          type="button"
          className="demo-progress-btn primary elite-focus-ring"
          onClick={() => onMarkDemoProgress?.(100)}
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
            Watch at least 80% of this topic to count it toward course
            completion and certificate eligibility.
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
          <h4>Tracking Mode</h4>
          <p>
            This video now tracks real watch milestones and updates course
            progress progressively.
          </p>
        </div>
      </div>

      <div className="video-player-feature-note premium-feature-note">
        <p>
          Real watch tracking is now active through video playback milestones.
          Next upgrade will add resume position, speed memory, and stronger
          anti-skip tracking.
        </p>
      </div>
    </div>
  );
}

export default VideoPlayerSection;