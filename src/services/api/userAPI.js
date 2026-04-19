import { apiClient } from "./client";

// All users
export const getUsers = async () => {
  return await apiClient.get("/users");
};

// Create user
export const createUser = async (user) => {
  return await apiClient.post("/users", user);
};