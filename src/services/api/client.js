import axios from "axios";

export const apiClient = axios.create({
  baseURL:import.meta.env.VITE_API_URL,// backend URL
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// for deployment try
// import axios from 'axios';

// const API = import.meta.env.VITE_API_BASE_URL;

// const client = axios.create({
//   baseURL: API,
// });

// export default client;