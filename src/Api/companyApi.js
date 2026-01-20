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

export const getAllCompanies = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/companies", { params });
    return response.data;
  }
  catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const getCompanyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/companies/${id}`);
    return response.data;
  }
  catch (error) {
    console.error(`Error fetching company with id ${id}:`, error);
    throw error;
  }
}

export const updateCompany = async (id, companyData) => {
  try {
    const response = await axiosInstance.put(`/api/companies/${id}`, companyData);
    return response.data;
  }
  catch (error) {
    console.error(`Error updating company with id ${id}:`, error);
    throw error;
  }
};

export const deleteCompany = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/companies/${id}`);
    return response.data;
  }

  catch (error) {
    console.error(`Error deleting company with id ${id}:`, error);
    throw error;
  }

};