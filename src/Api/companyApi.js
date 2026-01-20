import axiosInstance from "../utils/axiosInstance";

export const createCompany = async (companyData) => {
  try {
    const response = await axiosInstance.post("/api/companies", companyData);
    return response.data;
    } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};