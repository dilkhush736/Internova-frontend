import API from "./api";

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
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
    throw new Error(getErrorMessage(error, "Failed to fetch course progress"));
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
    throw new Error(getErrorMessage(error, "Failed to update video progress"));
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
    throw new Error(getErrorMessage(error, "Failed to unlock all modules"));
  }
};

export const createUnlockAllOrder = async (internshipId) => {
  try {
    validateInternshipId(internshipId);

    const { data } = await API.post("/payments/create-order", {
      internshipId,
      purchaseType: "unlock_all",
    });

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to create unlock-all payment order")
    );
  }
};

export const verifyUnlockAllPayment = async (payload = {}) => {
  try {
    const { data } = await API.post("/payments/verify", {
      razorpay_order_id: payload?.razorpay_order_id || "",
      razorpay_payment_id: payload?.razorpay_payment_id || "",
      razorpay_signature: payload?.razorpay_signature || "",
    });

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to verify unlock-all payment")
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