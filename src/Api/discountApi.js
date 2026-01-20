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