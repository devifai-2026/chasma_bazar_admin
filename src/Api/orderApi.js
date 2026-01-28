import axiosInstance from "../utils/axiosInstance";

export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post("/api/orders", orderData);
        return response.data;
    }
    catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const getAllOrders = async (params = {}) => {
    try {
        const response = await axiosInstance.get("/api/orders", { params });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/orders/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching order with id ${id}:`, error);
        throw error;
    }
};

export const updateOrder = async (id, orderData) => {
    try {
        const response = await axiosInstance.put(`/api/orders/${id}`, orderData);
        return response.data;
    }
    catch (error) {
        console.error(`Error updating order with id ${id}:`, error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/orders/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error deleting order with id ${id}:`, error);
        throw error;
    }
};

