import { apiClient } from "./client";

// GET all users
export const getUsers = async () => {
  return await apiClient.get("/users");
};

// CREATE user (optional for testing)
export const createUser = async (user) => {
  return await apiClient.post("/users", user);
};