import api from "./api";
import type { AdminOverview } from "@/types/admin";

const CACHE_KEY = "admin-overview-cache";
const CACHE_TTL = 30_000;

let memoryCache: { data: AdminOverview; updatedAt: number } | null = null;

function readSessionCache() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { data: AdminOverview; updatedAt: number };
    if (Date.now() - parsed.updatedAt > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: AdminOverview) {
  const payload = { data, updatedAt: Date.now() };
  memoryCache = payload;

  if (typeof window !== "undefined") {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  }
}

export const adminService = {
  async getOverview(force = false) {
    if (!force) {
      if (memoryCache && Date.now() - memoryCache.updatedAt <= CACHE_TTL) {
        return memoryCache.data;
      }

      const sessionCache = readSessionCache();
      if (sessionCache) {
        memoryCache = sessionCache;
        return sessionCache.data;
      }
    }

    const response = await api.get<AdminOverview>("/admin/overview");
    writeCache(response.data);
    return response.data;
  },

  invalidateOverviewCache() {
    memoryCache = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CACHE_KEY);
    }
  },

  async revalidateStorefront(productId?: string) {
    await fetch("/api/revalidate-storefront", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
  },
};
