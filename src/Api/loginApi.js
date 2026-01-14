import axiosInstance from "../utils/axiosInstance";


const LoginApi = async (userData) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", userData);
        return response;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export default LoginApi;