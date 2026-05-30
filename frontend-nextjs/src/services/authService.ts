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

  login: (data: { identifier: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),

  googleLogin: (credential: string) =>
    api.post<AuthResponse>("/auth/google", { credential }),

  me: () => api.get<User>("/auth/me"),

  syncClerk: (data: { clerkId: string; email: string; fullName: string; avatarUrl: string; phone?: string; address?: string }, token: string) =>
    api.post<User>("/users/sync-clerk", data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};
