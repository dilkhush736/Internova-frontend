import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  convertVideoUrlToEmbedUrl,
  isGoogleDriveLink,
  isYouTubeLink,
} from "../utils/googleDrive";

function VideoPlayerSection({
  selectedModule,
  selectedVideo,
  onPreviousVideo,
  onNextVideo,
  onTrackedProgress,
  onVideoEnded,
  hasPreviousVideo,
  hasNextVideo,
}) {
  const videoRef = useRef(null);
  const sentMilestonesRef = useRef(new Set());
  const completionToastShownRef = useRef(false);
  const completionHandledRef = useRef(false);
  const nextCountdownIntervalRef = useRef(null);
  const highestAllowedTimeRef = useRef(0);
  const lastSaveSecondRef = useRef(-1);
  const seekGuardToleranceRef = useRef(3);

  const [localProgress, setLocalProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [nextCountdown, setNextCountdown] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const milestoneSteps = useMemo(() => [10, 25, 50, 80, 100], []);

  const rawVideoUrl = selectedVideo?.videoUrl || "";
  const embeddedVideoUrl = convertVideoUrlToEmbedUrl(rawVideoUrl);

  const isYouTubeVideo =
    isYouTubeLink(rawVideoUrl) || isYouTubeLink(embeddedVideoUrl);

  const isGoogleDriveVideo =
    isGoogleDriveLink(rawVideoUrl) || isGoogleDriveLink(embeddedVideoUrl);

  const isIframeVideo = isGoogleDriveVideo || isYouTubeVideo;
  const isDirectVideo = !isIframeVideo;

  const resumeStorageKey = useMemo(() => {
    if (!selectedVideo?.id) return "";
    return `internova_video_resume_${selectedVideo.id}`;
  }, [selectedVideo?.id]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 2500);
  };

  const showCompletionToastOnce = () => {
    if (completionToastShownRef.current) return;
    completionToastShownRef.current = true;
    showToast(
      "success",
      `${selectedVideo?.title || "Video"} completed successfully`
    );
  };

  const clearNextCountdown = () => {
    if (nextCountdownIntervalRef.current) {
      clearInterval(nextCountdownIntervalRef.current);
      nextCountdownIntervalRef.current = null;
    }
    setNextCountdown(0);
  };

  const startNextCountdown = () => {
    if (!hasNextVideo || !onNextVideo) return;

    clearNextCountdown();
    setNextCountdown(3);

    let remaining = 3;
    nextCountdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setNextCountdown(remaining);

      if (remaining <= 0) {
        clearNextCountdown();
        onNextVideo();
      }
    }, 1000);
  };

  const saveResumePosition = (seconds) => {
    if (!resumeStorageKey || !Number.isFinite(seconds) || seconds < 0) return;

    try {
      localStorage.setItem(resumeStorageKey, String(Math.floor(seconds)));
    } catch (error) {
      console.error("Failed to save resume position:", error);
    }
  };

  const clearResumePosition = () => {
    if (!resumeStorageKey) return;

    try {
      localStorage.removeItem(resumeStorageKey);
    } catch (error) {
      console.error("Failed to clear resume position:", error);
    }
  };

  const getSavedResumePosition = () => {
    if (!resumeStorageKey) return 0;

    try {
      const raw = localStorage.getItem(resumeStorageKey);
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch (error) {
      console.error("Failed to read resume position:", error);
      return 0;
    }
  };

  const handleCompletionFlow = () => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    setLocalProgress(100);
    clearNextCountdown();
    clearResumePosition();
    showCompletionToastOnce();

    if (onVideoEnded) {
      onVideoEnded();
    }

    if (hasNextVideo) {
      startNextCountdown();
    }
  };

  useEffect(() => {
    const restoredProgress = selectedVideo?.watchedPercent || 0;

    setLocalProgress(restoredProgress);
    setVideoDuration(0);
    setNextCountdown(0);
    completionToastShownRef.current = false;
    completionHandledRef.current = false;
    sentMilestonesRef.current = new Set();
    highestAllowedTimeRef.current = 0;
    lastSaveSecondRef.current = -1;
    clearNextCountdown();

    milestoneSteps.forEach((step) => {
      if (restoredProgress >= step) {
        sentMilestonesRef.current.add(step);
      }
    });

    return () => {
      clearNextCountdown();
    };
  }, [selectedVideo, milestoneSteps]);

  const pushTrackedMilestone = (percent) => {
    if (!selectedVideo || !onTrackedProgress) return;

    if (!sentMilestonesRef.current.has(percent)) {
      sentMilestonesRef.current.add(percent);
      onTrackedProgress(percent);
    }
  };

  const syncRestoredTimeFromProgressAndResume = (duration) => {
    if (!duration || duration <= 0) return;

    const restoredProgress = selectedVideo?.watchedPercent || 0;
    const progressTime =
      restoredProgress > 0
        ? Math.floor((restoredProgress / 100) * duration)
        : 0;

    const savedResumeTime = getSavedResumePosition();
    const safeResumeTime = Math.min(savedResumeTime, Math.max(0, duration - 2));
    const startTime = Math.max(progressTime, safeResumeTime);

    highestAllowedTimeRef.current = startTime;

    if (videoRef.current && startTime > 0) {
      try {
        videoRef.current.currentTime = startTime;
      } catch (error) {
        console.error("Failed to restore playback time:", error);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const duration = videoRef.current?.duration || 0;
    setVideoDuration(duration);
    syncRestoredTimeFromProgressAndResume(duration);
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    const currentTime = video.currentTime;
    const maxAllowedForwardTime =
      highestAllowedTimeRef.current + seekGuardToleranceRef.current;

    if (currentTime > maxAllowedForwardTime) {
      video.currentTime = highestAllowedTimeRef.current;
      showToast("error", "Skipping ahead is restricted for progress tracking");
      return;
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    const currentTime = video.currentTime;

    if (currentTime > highestAllowedTimeRef.current) {
      highestAllowedTimeRef.current = currentTime;
    }

    const flooredSecond = Math.floor(highestAllowedTimeRef.current);
    if (flooredSecond !== lastSaveSecondRef.current) {
      lastSaveSecondRef.current = flooredSecond;
      saveResumePosition(highestAllowedTimeRef.current);
    }

    const watched = Math.min(
      100,
      Math.floor((highestAllowedTimeRef.current / video.duration) * 100)
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
    handleCompletionFlow();
  };

  const handlePreventContextMenu = (event) => {
    event.preventDefault();
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
    <div className="video-player-card premium-video-card position-relative">
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: "96px",
            right: "24px",
            zIndex: 99999,
            minWidth: "280px",
            maxWidth: "380px",
          }}
        >
          <div
            className="shadow-lg rounded-4 px-4 py-3"
            style={{
              background:
                toast.type === "success"
                  ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                  : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
              border:
                toast.type === "success"
                  ? "1px solid #86efac"
                  : "1px solid #fca5a5",
            }}
          >
            <div
              className={`fw-bold mb-1 ${
                toast.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {toast.type === "success" ? "Success" : "Error"}
            </div>
            <div className="text-dark small">{toast.message}</div>
          </div>
        </div>
      )}

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

      <div
        className="video-player-wrapper premium-video-wrapper"
        onContextMenu={handlePreventContextMenu}
      >
        {isIframeVideo ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "18px",
              overflow: "hidden",
              background: "#000",
            }}
          >
            <iframe
              key={selectedVideo.id}
              src={embeddedVideoUrl}
              title={selectedVideo.title || "Course Video"}
              className="internova-video-player"
              allow={
                isYouTubeVideo
                  ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  : "autoplay; fullscreen"
              }
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{
                width: "100%",
                height: "500px",
                border: "none",
                display: "block",
                borderRadius: "18px",
                background: "#000",
              }}
            />

            {!isYouTubeVideo && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "90px",
                  height: "90px",
                  zIndex: 10,
                  background: "transparent",
                  cursor: "default",
                }}
                aria-hidden="true"
              />
            )}
          </div>
        ) : (
          <video
            ref={videoRef}
            key={selectedVideo.id}
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={handlePreventContextMenu}
            className="internova-video-player"
            src={rawVideoUrl}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onSeeked={handleSeeked}
            onEnded={handleEndedInternal}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="video-player-controls-note premium-chip-row">
        {isDirectVideo ? (
          <>
            <div className="player-feature-chip">Auto Progress Active</div>
            <div className="player-feature-chip">Anti-Skip Enabled</div>
            <div className="player-feature-chip">Resume Enabled</div>
          </>
        ) : (
          <div className="player-feature-chip">Embed Playback Only</div>
        )}

        <div className="player-feature-chip">Replay</div>
        <div className="player-feature-chip">Speed Control</div>
        <div className="player-feature-chip">
          {isGoogleDriveVideo
            ? "Drive Player"
            : isYouTubeVideo
            ? "YouTube Embed"
            : "Protected Player"}
        </div>
        <div className="player-feature-chip">Fullscreen</div>
        <div className="player-feature-chip">
          {hasNextVideo ? "Autoplay Next Ready" : "Last Video"}
        </div>
      </div>

      {nextCountdown > 0 && hasNextVideo && (
        <div
          style={{
            marginTop: "14px",
            padding: "14px 18px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #93c5fd",
            color: "#1e3a8a",
            fontWeight: 800,
            textAlign: "center",
            boxShadow: "0 12px 24px rgba(59,130,246,0.12)",
          }}
        >
          Next video starts in {nextCountdown} second
          {nextCountdown > 1 ? "s" : ""}
        </div>
      )}

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
            {isDirectVideo
              ? "Automatic real watch tracking with anti-skip protection and resume playback is active for this direct video source."
              : "This embedded source plays correctly, but exact automatic watch tracking is not available in the current iframe-based setup."}
          </p>
        </div>
      </div>

      <div className="video-player-feature-note premium-feature-note">
        <p>
          {isDirectVideo
            ? "Direct hosted videos now use automatic real playback tracking with anti-skip protection and resume-from-last-position support."
            : isYouTubeVideo
            ? "YouTube videos are running in embedded mode. Playback works, but exact automatic progress tracking is not supported in this current setup."
            : "Google Drive videos are running in embedded mode. Playback works, but exact automatic progress tracking is not supported in this current setup."}
        </p>
      </div>
    </div>
  );
}

export default VideoPlayerSection;