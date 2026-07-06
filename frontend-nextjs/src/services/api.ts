import axios from "axios";

const defaultBaseURL =
  typeof window === "undefined" ? "http://127.0.0.1:8080/api" : "/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || defaultBaseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    let token = null;
    
    if ((window as any).Clerk?.session) {
      try {
        token = await (window as any).Clerk.session.getToken();
      } catch (e) {}
    }

    if (!token) {
      token = localStorage.getItem("token");
    }

    if (token && !config.headers.Authorization && !config.url?.includes('/payment/vnpay_return')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && typeof window !== "undefined" && !originalRequest._retry) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Retry the request once without the Authorization header (for public endpoints like GET reviews)
      if (originalRequest.method === "get") {
        originalRequest._retry = true;
        delete originalRequest.headers.Authorization;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
