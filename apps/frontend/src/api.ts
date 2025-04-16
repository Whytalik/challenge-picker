import axios from "axios";

const MAX_RETRIES = 2;

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // Authentication headers here if needed in the future
    // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
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
  async (error) => {
    const originalRequest = error.config;

    // Add retry mechanism for network errors or 5xx server errors
    if (
      (error.response && error.response.status >= 500) ||
      error.code === "ECONNABORTED" ||
      !error.response
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = 0;
      }

      if (originalRequest._retry < MAX_RETRIES) {
        originalRequest._retry++;

        console.log(
          `Retrying request (${originalRequest._retry}/${MAX_RETRIES}): ${originalRequest.url}`
        );

        const delay = 1000 * Math.pow(2, originalRequest._retry - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        return api(originalRequest);
      }
    }

    if (error.response) {
      console.error("Server error:", error.response.data);

      switch (error.response.status) {
        case 401:
          console.error("Unauthorized - You might need to login.");
          break;
        case 403:
          console.error(
            "Forbidden - You do not have permission to access this resource."
          );
          break;
        case 404:
          console.error("Not found - The requested resource was not found.");
          break;
        case 500:
          console.error("Server error - Something went wrong on the server.");
          break;
      }
    } else if (error.request) {
      console.error("Network error: No response received from server");
    } else {
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API helper methods for cleaner code elsewhere in the application
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
