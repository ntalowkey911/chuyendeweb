import { create } from "zustand";
import type { AuthResponse, Role, User } from "@/types/user";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  hydrated: boolean;
  setAuth: (data: AuthResponse) => void;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
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
  hydrated: false,

  setAuth: (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role,
      })
    );
    set({
      token: data.token,
      user: {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role as Role,
      },
      hydrated: true,
    });
  },

  login: async (identifier, password) => {
    const res = await authService.login({ identifier, password });
    get().setAuth(res.data);
  },

  loginWithGoogle: async (credential) => {
    const res = await authService.googleLogin(credential);
    get().setAuth(res.data);
  },

  register: async (data) => {
    await authService.register(data);
  },

  fetchMe: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ hydrated: true });
      return;
    }
    try {
      const res = await authService.me();
      set({ user: res.data, hydrated: true });
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, hydrated: true });
  },

  isAdmin: () => get().user?.role === "ADMIN",

  hydrate: () => {
    if (get().hydrated) {
      return;
    }

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) as User, hydrated: true });
      return;
    }
    set({ hydrated: true });
  },
}));
