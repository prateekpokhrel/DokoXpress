import axios from "axios";

//  Base URL
const API = axios.create({
    baseURL: "http://localhost:8081/api",
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// PRODUCT APIs

// Add Product
export const addProduct = async (product) => {
    try {
        const res = await API.post("/products", product);
        return res;
    } catch (error) {
        console.error("Add Product Error:", error.response?.data || error.message);
        throw error;
    }
};

// Get All Products
export const getProducts = async () => {
    try {
        const res = await API.get("/products");
        return res;
    } catch (error) {
        console.error("Get Products Error:", error.response?.data || error.message);
        throw error;
    }
};

// Delete Product (future use)
export const deleteProduct = async (id) => {
    try {
        const res = await API.delete(`/products/${id}`);
        return res;
    } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        throw error;
    }
};