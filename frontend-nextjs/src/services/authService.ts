import api from "./api";
import type { AuthResponse, User } from "@/types/user";

export const authService = {
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => api.post<AuthResponse>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),

  me: () => api.get<User>("/auth/me"),
};
