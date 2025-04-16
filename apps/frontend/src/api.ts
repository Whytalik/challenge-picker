import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Event bus for error notifications
export const apiErrorEvents = {
  listeners: new Set<(message: string, type: string) => void>(),
  emit(message: string, type = "error") {
    this.listeners.forEach((listener) => listener(message, type));
  },
  subscribe(callback: (message: string, type: string) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Increased timeout
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    apiErrorEvents.emit("Request error. Please try again.");
    return Promise.reject(error);
  }
);

// Error message mapper
const getErrorMessage = (status: number, data?: any): string => {
  // Try to extract a meaningful message from the response
  if (data) {
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error)
      return typeof data.error === "string" ? data.error : "Request failed";
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map((err: any) => err.message || err).join(", ");
    }
  }

  // Default messages based on status code
  switch (status) {
    case 400:
      return "Invalid request. Please check your data.";
    case 401:
      return "Authentication required. Please log in.";
    case 403:
      return "You don't have permission to access this resource.";
    case 404:
      return "The requested resource was not found.";
    case 422:
      return "Validation error. Please check your input.";
    case 500:
      return "Server error. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      return `Request failed with status ${status}`;
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    let errorMessage = "Network error. Please check your connection.";

    if (error.response) {
      const { status, data } = error.response;
      errorMessage = getErrorMessage(status, data);

      // Log detailed error info for debugging
      console.error("API Error:", {
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
        message: errorMessage,
      });

      // Emit error event for UI notifications
      apiErrorEvents.emit(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.message);

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      }

      apiErrorEvents.emit(errorMessage);
    } else {
      // Something happened in setting up the request
      console.error("Request Error:", error.message);
      apiErrorEvents.emit("An error occurred while sending the request.");
    }

    return Promise.reject({
      ...error,
      friendlyMessage: errorMessage,
    });
  }
);

// API service with typed methods
export const apiService = {
  challenges: {
    getAll: () => api.get("/challenge"),
    getById: (id: string) => api.get(`/challenge/${id}`),
    getRandom: () => api.get("/challenge/random"),
    create: (data: { title: string; description?: string }) =>
      api.post("/challenge", data),
    update: (id: string, data: { title?: string; description?: string }) =>
      api.patch(`/challenge/${id}`, data),
    delete: (id: string) => api.delete(`/challenge/${id}`),
  },
};

export default api;
