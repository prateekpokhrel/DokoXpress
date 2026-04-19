import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8081/api", // backend URL
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});