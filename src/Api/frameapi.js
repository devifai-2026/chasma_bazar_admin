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

export const getFrames = async () => {
  try {
    const response = await axiosInstance.get("/api/frames");  
    return response.data;
  }
  catch (error) {
    console.error("Error fetching frames:", error);
    throw error;
  }
};

export const getFrameById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/frames/${id}`);
    return response.data;
  }
  catch (error) {
    console.error(`Error fetching frame with id ${id}:`, error);
    throw error;
  }
};

export const updateFrame = async (id, frameData) => {
  try {
    const response = await axiosInstance.put(`/api/frames/${id}`, frameData);
    return response.data;
  }
  catch (error) {
    console.error(`Error updating frame with id ${id}:`, error);
    throw error;
  }
};

export const deleteFrame = async (id) => {

  try {
    const response = await axiosInstance.delete(`/api/frames/${id}`);
    return response.data;
  }
  catch (error) {
    console.error(`Error deleting frame with id ${id}:`, error);
    throw error;
  }
};
