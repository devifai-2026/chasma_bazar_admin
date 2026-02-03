import axiosInstance from "../utils/axiosInstance";

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post("/api/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getAllProducts = async (queryParams = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add all filter parameters
    if (queryParams.category) params.append('category', queryParams.category);
    if (queryParams.gender) params.append('gender', queryParams.gender);
    if (queryParams.company) params.append('company', queryParams.company);
    if (queryParams.frameType) params.append('frameType', queryParams.frameType);
    if (queryParams.frameShape) params.append('frameShape', queryParams.frameShape);
    if (queryParams.frameSize) params.append('frameSize', queryParams.frameSize);
    if (queryParams.minPrice) params.append('minPrice', queryParams.minPrice);
    if (queryParams.maxPrice) params.append('maxPrice', queryParams.maxPrice);
    if (queryParams.material) params.append('material', queryParams.material);
    if (queryParams.search) params.append('search', queryParams.search);
    
    // Add pagination
    params.append('page', queryParams.page || 1);
    params.append('limit', queryParams.limit || 10);
    
    const response = await axiosInstance.get(`/api/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/api/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};