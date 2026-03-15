import API from "./api";

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

const validateInternshipId = (internshipId) => {
  if (!internshipId || typeof internshipId !== "string") {
    throw new Error("Valid internship ID is required");
  }
};

export const getCourseProgress = async (internshipId) => {
  try {
    validateInternshipId(internshipId);

    const { data } = await API.get(`/progress/course/${internshipId}`);
    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch course progress")
    );
  }
};

export const updateVideoProgress = async (internshipId, payload = {}) => {
  try {
    validateInternshipId(internshipId);

    const safePayload = {
      moduleId: payload?.moduleId || "",
      videoId: payload?.videoId || "",
      watchedPercent: Number(payload?.watchedPercent || 0),
    };

    const { data } = await API.patch(
      `/progress/course/${internshipId}/video`,
      safePayload
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to update video progress")
    );
  }
};

export const unlockAllModules = async (internshipId) => {
  try {
    validateInternshipId(internshipId);

    const { data } = await API.patch(
      `/progress/course/${internshipId}/unlock-all`
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to unlock all modules")
    );
  }
};

export const getEligibilityStatus = async (internshipId) => {
  try {
    validateInternshipId(internshipId);

    const { data } = await API.get(
      `/progress/course/${internshipId}/eligibility`
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch eligibility status")
    );
  }
};