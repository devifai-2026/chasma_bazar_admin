import axiosInstance from "../utils/axiosInstance";

export const createPromoCode = async (promoCodeData) => {
  try {
    const response = await axiosInstance.post("/api/promos", promoCodeData);
    return response.data;
  } catch (error) {
    console.error("Error creating promo code:", error);
    throw error;
  }
};

export const getAllPromoCodes = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/promos", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    throw error;
  }
};

export const getPromoCodeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/promos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching promo code with id ${id}:`, error);
    throw error;
  }
};

export const updatePromoCode = async (id, promoCodeData) => {
  try {
    const response = await axiosInstance.put(`/api/promos/${id}`, promoCodeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating promo code with id ${id}:`, error);
    throw error;
  }
};

export const deletePromoCode = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/promos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting promo code with id ${id}:`, error);
    throw error;
  }
};
