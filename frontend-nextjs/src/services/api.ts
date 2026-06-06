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
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Don't forcefully redirect to /login here if we're dealing with Clerk auth
      // The useAuth hook in AuthHydrate handles the logout properly when token expires
    }
    return Promise.reject(error);
  }
);

export default api;
