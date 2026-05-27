import { create } from "zustand";
import type { AuthResponse, Role, User } from "@/types/user";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (data: AuthResponse) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,

  setAuth: (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      })
    );
    set({
      token: data.token,
      user: {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role as Role,
      },
    });
  },

  login: async (email, password) => {
    const res = await authService.login({ email, password });
    get().setAuth(res.data);
  },

  register: async (data) => {
    await authService.register(data);
  },

  fetchMe: async () => {
    try {
      const res = await authService.me();
      set({ user: res.data });
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  isAdmin: () => get().user?.role === "ADMIN",

  hydrate: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },
}));
