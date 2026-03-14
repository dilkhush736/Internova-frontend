import API from "./api";

export const getCourseProgress = async (internshipId) => {
  const { data } = await API.get(`/progress/course/${internshipId}`);
  return data;
};

export const updateVideoProgress = async (internshipId, payload) => {
  const { data } = await API.patch(
    `/progress/course/${internshipId}/video`,
    payload
  );
  return data;
};

export const unlockAllModules = async (internshipId) => {
  const { data } = await API.patch(
    `/progress/course/${internshipId}/unlock-all`
  );
  return data;
};

export const getEligibilityStatus = async (internshipId) => {
  const { data } = await API.get(
    `/progress/course/${internshipId}/eligibility`
  );
  return data;
};