import React, { useEffect, useMemo, useRef, useState } from "react";
import "./VideoPlayerSection.css";
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
  const lastSaveSecondRef = useRef(-1);
  const watchedSecondsRef = useRef(new Set());
  const autoplayRetryTimerRef = useRef(null);

  const [localProgress, setLocalProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isEligibleComplete, setIsEligibleComplete] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const rawVideoUrl = selectedVideo?.videoUrl || "";
  const embeddedVideoUrl = convertVideoUrlToEmbedUrl(rawVideoUrl);

  const isYouTubeVideo =
    isYouTubeLink(rawVideoUrl) || isYouTubeLink(embeddedVideoUrl);

  const isGoogleDriveVideo =
    isGoogleDriveLink(rawVideoUrl) || isGoogleDriveLink(embeddedVideoUrl);

  const isIframeVideo = isGoogleDriveVideo || isYouTubeVideo;
  const isDirectVideo = !isIframeVideo;

  const requiredWatchPercent = 80;
  const milestoneSteps = useMemo(() => [10, 25, 50, 80, 100], []);
  const segmentCompletionThreshold = 0.65;

  const resumeStorageKey = useMemo(() => {
    if (!selectedVideo?.id) return "";
    return `internova_video_resume_${selectedVideo.id}`;
  }, [selectedVideo?.id]);

  const watchedStorageKey = useMemo(() => {
    if (!selectedVideo?.id) return "";
    return `internova_video_watched_${selectedVideo.id}`;
  }, [selectedVideo?.id]);

  const autoplayEmbedUrl = useMemo(() => {
    if (!embeddedVideoUrl) return "";

    try {
      const url = new URL(embeddedVideoUrl);

      if (isYouTubeVideo) {
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("mute", "1");
        url.searchParams.set("playsinline", "1");
        url.searchParams.set("rel", "0");
      }

      if (isGoogleDriveVideo) {
        url.searchParams.set("autoplay", "1");
      }

      return url.toString();
    } catch (error) {
      return embeddedVideoUrl;
    }
  }, [embeddedVideoUrl, isYouTubeVideo, isGoogleDriveVideo]);

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

  const saveResumePosition = (seconds) => {
    if (!resumeStorageKey || !Number.isFinite(seconds) || seconds < 0) return;

    try {
      localStorage.setItem(resumeStorageKey, String(Math.floor(seconds)));
    } catch (error) {
      console.error("Failed to save resume position:", error);
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

  const clearResumePosition = () => {
    if (!resumeStorageKey) return;

    try {
      localStorage.removeItem(resumeStorageKey);
    } catch (error) {
      console.error("Failed to clear resume position:", error);
    }
  };

  const saveWatchedSeconds = () => {
    if (!watchedStorageKey) return;

    try {
      localStorage.setItem(
        watchedStorageKey,
        JSON.stringify([...watchedSecondsRef.current])
      );
    } catch (error) {
      console.error("Failed to save watched seconds:", error);
    }
  };

  const loadWatchedSeconds = () => {
    if (!watchedStorageKey) return new Set();

    try {
      const raw = localStorage.getItem(watchedStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return new Set();

      return new Set(
        parsed
          .map((item) => Number(item))
          .filter((item) => Number.isFinite(item) && item >= 0)
      );
    } catch (error) {
      console.error("Failed to load watched seconds:", error);
      return new Set();
    }
  };

  const clearWatchedSeconds = () => {
    if (!watchedStorageKey) return;

    try {
      localStorage.removeItem(watchedStorageKey);
    } catch (error) {
      console.error("Failed to clear watched seconds:", error);
    }
  };

  const clearAutoPlayRetry = () => {
    if (autoplayRetryTimerRef.current) {
      clearTimeout(autoplayRetryTimerRef.current);
      autoplayRetryTimerRef.current = null;
    }
  };

  const attemptDirectAutoplay = () => {
    if (!isDirectVideo || !videoRef.current) return;

    try {
      const playPromise = videoRef.current.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          clearAutoPlayRetry();
          autoplayRetryTimerRef.current = setTimeout(() => {
            try {
              videoRef.current?.play?.().catch?.(() => {});
            } catch (error) {
              console.error("Retry autoplay failed:", error);
            }
          }, 350);
        });
      }
    } catch (error) {
      console.error("Autoplay failed:", error);
    }
  };

  const formatDuration = (seconds = 0) => {
    const safe = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const secs = safe % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const getSegmentBasedProgress = (duration) => {
    if (!duration || duration <= 0) return 0;

    const totalSeconds = Math.ceil(duration);
    const segmentSize = totalSeconds / 4;
    let completedSegments = 0;

    for (let i = 0; i < 4; i += 1) {
      const start = Math.floor(i * segmentSize);
      const end = i === 3 ? totalSeconds : Math.floor((i + 1) * segmentSize);

      const segmentLength = Math.max(1, end - start);
      let watchedInSegment = 0;

      for (let sec = start; sec < end; sec += 1) {
        if (watchedSecondsRef.current.has(sec)) {
          watchedInSegment += 1;
        }
      }

      const ratio = watchedInSegment / segmentLength;
      if (ratio >= segmentCompletionThreshold) {
        completedSegments += 1;
      }
    }

    return completedSegments * 25;
  };

  const pushTrackedMilestone = (percent) => {
    if (!selectedVideo || !onTrackedProgress) return;

    if (!sentMilestonesRef.current.has(percent)) {
      sentMilestonesRef.current.add(percent);
      onTrackedProgress(percent);
    }
  };

  const updateProgressState = (duration) => {
    const computedProgress = getSegmentBasedProgress(duration);
    const effectiveProgress = Math.max(
      selectedVideo?.watchedPercent || 0,
      computedProgress
    );

    setLocalProgress(effectiveProgress);
    setIsEligibleComplete(effectiveProgress >= requiredWatchPercent);

    milestoneSteps.forEach((step) => {
      if (effectiveProgress >= step) {
        pushTrackedMilestone(step);
      }
    });

    return effectiveProgress;
  };

  const handleCompletionFlow = async () => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    clearResumePosition();
    clearWatchedSeconds();
    setIsEligibleComplete(true);
    setLocalProgress(100);
    showCompletionToastOnce();

    if (onVideoEnded) {
      await onVideoEnded();
    }
  };

  useEffect(() => {
    const restoredProgress = selectedVideo?.watchedPercent || 0;

    setLocalProgress(restoredProgress);
    setVideoDuration(0);
    setIsEligibleComplete(restoredProgress >= requiredWatchPercent);
    completionToastShownRef.current = false;
    completionHandledRef.current = false;
    sentMilestonesRef.current = new Set();
    lastSaveSecondRef.current = -1;
    watchedSecondsRef.current = new Set();
    clearAutoPlayRetry();

    milestoneSteps.forEach((step) => {
      if (restoredProgress >= step) {
        sentMilestonesRef.current.add(step);
      }
    });

    return () => {
      clearAutoPlayRetry();
    };
  }, [selectedVideo, milestoneSteps]);

  useEffect(() => {
    if (!selectedVideo || !isDirectVideo) return;

    const timer = setTimeout(() => {
      attemptDirectAutoplay();
    }, 220);

    return () => clearTimeout(timer);
  }, [selectedVideo, isDirectVideo]);

  const syncRestoredState = (duration) => {
    if (!duration || duration <= 0) return;

    watchedSecondsRef.current = loadWatchedSeconds();

    const savedResumeTime = getSavedResumePosition();
    const safeResumeTime = Math.min(savedResumeTime, Math.max(0, duration - 2));

    if (videoRef.current && safeResumeTime > 0) {
      try {
        videoRef.current.currentTime = safeResumeTime;
      } catch (error) {
        console.error("Failed to restore playback time:", error);
      }
    }

    updateProgressState(duration);
  };

  const handleLoadedMetadata = () => {
    const duration = videoRef.current?.duration || 0;
    setVideoDuration(duration);
    syncRestoredState(duration);
    attemptDirectAutoplay();
  };

  const handleCanPlay = () => {
    attemptDirectAutoplay();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    const current = video.currentTime;
    const flooredSecond = Math.floor(current);

    watchedSecondsRef.current.add(flooredSecond);

    if (flooredSecond !== lastSaveSecondRef.current) {
      lastSaveSecondRef.current = flooredSecond;
      saveResumePosition(current);
      saveWatchedSeconds();
    }

    updateProgressState(video.duration);
  };

  const handleEndedInternal = async () => {
    const video = videoRef.current;
    const duration = video?.duration || videoDuration || 0;
    const effectiveProgress = updateProgressState(duration);

    if (effectiveProgress >= requiredWatchPercent) {
      pushTrackedMilestone(100);
      await handleCompletionFlow();
    } else {
      showToast(
        "error",
        `Complete at least ${requiredWatchPercent}% required segments to finish this video`
      );
    }
  };

  const handlePreventContextMenu = (event) => {
    event.preventDefault();
  };

  const progressBarWidth = `${Math.min(100, Math.max(0, localProgress))}%`;

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
        <div className="video-toast-container">
          <div
            className={`video-toast-box ${
              toast.type === "success" ? "success" : "error"
            }`}
          >
            <div
              className={`video-toast-title ${
                toast.type === "success" ? "success" : "error"
              }`}
            >
              {toast.type === "success" ? "Success" : "Error"}
            </div>
            <div className="video-toast-message">{toast.message}</div>
          </div>
        </div>
      )}

      <div className="video-progress-summary-card premium-summary-card">
        <div className="video-progress-summary-top">
          <div>
            <div className="video-progress-summary-label">
              Smart Progress Tracking
            </div>
            <div className="video-progress-summary-title">
              Verified Segment Progress: {localProgress}%
            </div>
          </div>

          <div className="video-progress-badges">
            <span
              className={`video-status-badge ${
                isEligibleComplete ? "completed" : "progress"
              }`}
            >
              {isEligibleComplete ? "Completed" : "Watching"}
            </span>
          </div>
        </div>

        <div className="video-progress-bar-track">
          <div
            className={`video-progress-bar-fill ${
              localProgress >= requiredWatchPercent ? "completed" : "progress"
            }`}
            style={{ width: progressBarWidth }}
          />
        </div>

        <div className="video-progress-summary-bottom">
          <small>
            {isDirectVideo
              ? "Protected direct playback"
              : "Embedded playback mode"}
          </small>
          <small>
            {videoDuration
              ? `Duration: ${formatDuration(videoDuration)}`
              : "Duration loading..."}
          </small>
        </div>
      </div>

      <div
        className="video-player-wrapper premium-video-wrapper"
        onContextMenu={handlePreventContextMenu}
      >
        {isIframeVideo ? (
          <div className="video-frame-shell">
            <iframe
              key={selectedVideo.id}
              src={autoplayEmbedUrl}
              title={selectedVideo.title || "Course Video"}
              className="internova-video-player video-embed-frame"
              allow={
                isYouTubeVideo
                  ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  : "autoplay; fullscreen"
              }
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="video-frame-shell">
            <video
              ref={videoRef}
              key={selectedVideo.id}
              controls
              autoPlay
              playsInline
              muted={false}
              preload="auto"
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={handlePreventContextMenu}
              className="internova-video-player video-direct-player"
              src={rawVideoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={handleCanPlay}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEndedInternal}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
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
            {selectedVideo.description ||
              "This lesson helps the learner focus on the main concept before moving ahead."}
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Verification Rule</h4>
          <p>
            This player uses segment-based verification, so only real watched
            coverage counts toward completion.
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Tracking Mode</h4>
          <p>
            {isDirectVideo
              ? "Direct video uses smart progress validation, resume support, and automatic next video flow."
              : "Embedded playback works, but strict auto-detection depends on the platform restrictions."}
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Status</h4>
          <p>
            {isEligibleComplete
              ? "This topic has reached the required verified watch threshold."
              : `Current verified completion is ${localProgress}%. Continue watching naturally to complete this lesson.`}
          </p>
        </div>
      </div>

      <div className="video-player-feature-note premium-feature-note">
        <p>
          {isDirectVideo
            ? "Watch the lesson naturally for the best experience. Seekbar dragging alone does not complete progress."
            : isYouTubeVideo
            ? "YouTube is running in embed mode, so autoplay and end-detection may vary depending on browser rules."
            : "Google Drive is running in embed mode, so autoplay and end-detection may vary depending on browser rules."}
        </p>
      </div>
    </div>
  );
}

export default VideoPlayerSection;