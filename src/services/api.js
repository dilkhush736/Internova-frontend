import axios from "axios";

console.log("API BASE URL:", process.env.REACT_APP_API_BASE_URL);

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;