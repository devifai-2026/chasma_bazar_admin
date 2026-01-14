import axiosInstance from "../utils/axiosInstance";

// Get all users with pagination and filters
export const getUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/users", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user statistics
export const getUsersStatistics = async () => {
  try {
    const response = await axiosInstance.get("/api/users/statistics");
    return response.data;
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user (soft delete)
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Toggle user status
export const toggleUserStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/api/users/${id}`, {
      accountStatus: status === "Active" ? "inactive" : "active",
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw error;
  }
};

// Restore user
export const restoreUser = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/users/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error("Error restoring user:", error);
    throw error;
  }
};