import axiosInstance from "../utils/axiosInstance";

export const createFrame = async (frameData) => {
  try {
    const response = await axiosInstance.post("/api/frames", frameData);
    return response.data;
    } catch (error) {
    console.error("Error creating frame:", error);
    throw error;
  }
};