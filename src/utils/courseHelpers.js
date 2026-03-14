export const calculateWatchedVideos = (modules) => {
  let watched = 0;
  let total = 0;

  modules.forEach((module) => {
    module.videos.forEach((video) => {
      total += 1;
      if (video.watchedPercent > 0) watched += 1;
    });
  });

  return { watched, total };
};

export const calculateCompletedModules = (modules) => {
  const completed = modules.filter((module) =>
    module.videos.every((video) => video.completed)
  ).length;

  return {
    completed,
    total: modules.length,
  };
};

export const calculateOverallProgress = (modules) => {
  let totalVideos = 0;
  let totalPercent = 0;

  modules.forEach((module) => {
    module.videos.forEach((video) => {
      totalVideos += 1;
      totalPercent += video.watchedPercent || 0;
    });
  });

  if (!totalVideos) return 0;
  return Math.round(totalPercent / totalVideos);
};

export const calculateDaysCompleted = (enrolledDate, durationDays) => {
  const start = new Date(enrolledDate);
  const today = new Date();

  const diffTime = today - start;
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

  return {
    completedDays: diffDays > durationDays ? durationDays : diffDays,
    totalDays: durationDays,
  };
};

export const isDurationCompleted = (enrolledDate, durationDays) => {
  const { completedDays } = calculateDaysCompleted(enrolledDate, durationDays);
  return completedDays >= durationDays;
};

export const getUnlockedModules = (modules, completedDays, unlockAllPurchased) => {
  return modules.map((module) => ({
    ...module,
    isUnlocked: unlockAllPurchased || completedDays >= module.unlockDay,
  }));
};

export const getCertificateEligibility = ({
  progress,
  requiredProgress,
  miniTestPassed,
  durationCompleted,
}) => {
  return {
    progressCompleted: progress >= requiredProgress,
    miniTestCompleted: miniTestPassed,
    durationCompleted,
    eligible:
      progress >= requiredProgress && miniTestPassed && durationCompleted,
  };
};

export const getFirstAvailableVideo = (modules) => {
  for (const module of modules) {
    if (module.isUnlocked) {
      for (const video of module.videos) {
        if (!video.completed) return { module, video };
      }
      if (module.videos.length > 0) {
        return { module, video: module.videos[0] };
      }
    }
  }

  return { module: null, video: null };
};

export const getAllUnlockedVideos = (modules) => {
  return modules
    .filter((module) => module.isUnlocked)
    .flatMap((module) =>
      module.videos.map((video) => ({
        module,
        video,
      }))
    );
};

export const getNextVideoItem = (modules, currentVideoId) => {
  const allVideos = getAllUnlockedVideos(modules);
  const currentIndex = allVideos.findIndex(
    (item) => item.video.id === currentVideoId
  );

  if (currentIndex >= 0 && currentIndex < allVideos.length - 1) {
    return allVideos[currentIndex + 1];
  }

  return null;
};

export const markVideoProgress = (modules, targetVideoId, watchedPercent) => {
  return modules.map((module) => {
    const updatedVideos = module.videos.map((video) => {
      if (video.id !== targetVideoId) return video;

      const safePercent = Math.max(video.watchedPercent || 0, watchedPercent);
      return {
        ...video,
        watchedPercent: safePercent,
        completed: safePercent >= 80,
      };
    });

    return {
      ...module,
      videos: updatedVideos,
    };
  });
};

export const getNextIncompleteVideo = (modules) => {
  for (const module of modules) {
    if (!module.isUnlocked) continue;

    for (const video of module.videos) {
      if ((video.watchedPercent || 0) < 80) {
        return { module, video };
      }
    }
  }

  return null;
};