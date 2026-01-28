import axiosInstance from "../utils/axiosInstance";



export const getAllOrders = async (params = {}) => {
    try {
        const response = await axiosInstance.get("/api/orders/admin/all", { params });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

;

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/orders/${id}/status`, { status });
        return response.data;
    }
    catch (error) {
        console.error(`Error updating order status for id ${id}:`, error);
        throw error;
    }
};



