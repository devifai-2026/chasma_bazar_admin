import axiosInstance from "../utils/axiosInstance";

export const createDiscount = async (discountData) => {
  try {
    const response = await axiosInstance.post("/api/discounts", discountData);
    return response.data;
    } catch (error) {
    console.error("Error creating discount:", error);
    throw error;
  }
};

export const getAllDiscounts = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/discounts", { params });
    return response.data;
  }
  catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

export const getDiscountById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/discounts/${id}`);
    return response.data;
  }
  catch (error) {
    console.error(`Error fetching discount with id ${id}:`, error);
    throw error;
  }
}

export const updateDiscount = async (id, discountData) => {
  try {
    const response = await axiosInstance.put(`/api/discounts/${id}`, discountData);
    return response.data;
  }
  catch (error) {
    console.error(`Error updating discount with id ${id}:`, error);
    throw error;
  }
};

export const deleteDiscount = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/discounts/${id}`);
    return response.data;
  }
  catch (error) {
    console.error(`Error deleting discount with id ${id}:`, error);
    throw error;
  }
};