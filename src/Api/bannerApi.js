import axiosInstance from "../utils/axiosInstance";

export const createBanner = async (bannerData) => {
  try {
    const response = await axiosInstance.post("/api/banners", bannerData);
    return response.data;
  }
    catch (error) {
    console.error("Error creating banner:", error);
    throw error;
    }
};

export const getAllBanners = async (params = {}) => {
    try {
    const response = await axiosInstance.get("/api/banners", { params });
    return response.data;
    } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
    }
};

export const getBannerById = async (id) => {
    try {
    const response = await axiosInstance.get(`/api/banners/${id}`);
    return response.data;
    } catch (error) {
    console.error(`Error fetching banner with id ${id}:`, error);
    throw error;
    }
};

export const updateBanner = async (id, bannerData) => {
    try {
    const response = await axiosInstance.put(`/api/banners/${id}`, bannerData);
    return response.data;
    } catch (error) {
    console.error(`Error updating banner with id ${id}:`, error);
    throw error;
    }
};

export const deleteBanner = async (id) => {
    try {
    const response = await axiosInstance.delete(`/api/banners/${id}`);
    return response.data;
    } catch (error) {
    console.error(`Error deleting banner with id ${id}:`, error);
    throw error;
    }
};

