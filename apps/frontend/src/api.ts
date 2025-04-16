import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          console.error("Request failed - Please try again.");
          break;
        case 403:
          console.error("Access denied.");
          break;
        case 404:
          console.error("Resource not found.");
          break;
        case 500:
          console.error("Server error - Please try again later.");
          break;
        default:
          console.error(`Error: ${error.message}`);
      }
    } else {
      console.error("Network error - Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  challenges: {
    getAll: () => api.get("/challenge"),
    getById: (id: string) => api.get(`/challenge/${id}`),
    getRandom: () => api.get("/challenge/random"),
    create: (data: { title: string; description: string }) =>
      api.post("/challenge", data),
    update: (id: string, data: { title?: string; description?: string }) =>
      api.patch(`/challenge/${id}`, data),
    delete: (id: string) => api.delete(`/challenge/${id}`),
  },
};

export default api;
