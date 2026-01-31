import axiosInstance from "../utils/axiosInstance";

export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get("/api/dashboard/stats");   
    return response.data;
    } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
    }
};

export const getRecentUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/dashboard/users");   
    return response.data;
    } catch (error) {
    console.error("Error fetching recent users:", error);
    throw error;
    }
};

export const getAllRecentOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/dashboard/orders/recent");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

export const getAllPerformanceMetrics = async () => {
  try {
    const response = await axiosInstance.get("/api/dashboard/performance");
    return response.data;
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    throw error;
  }
}