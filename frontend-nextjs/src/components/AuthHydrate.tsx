"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function AuthHydrate() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { setAuth, logout, user: localUser } = useAuthStore();

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user && !localUser) {
        try {
          const token = await getToken();
          if (token) {
            const res = await authService.syncClerk({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress || "",
              fullName: user.fullName || "",
              avatarUrl: user.imageUrl || "",
              phone: (user.unsafeMetadata?.phone as string) || "",
              address: (user.unsafeMetadata?.address as string) || ""
            }, token);
            setAuth({
              userId: res.data.id,
              fullName: res.data.fullName,
              email: res.data.email,
              role: res.data.role,
              token: token
            });
          }
        } catch (e) {
          console.error("Sync failed", e);
        }
      } else if (!isSignedIn && localUser) {
        logout();
      }
    };
    syncUser();
  }, [isSignedIn, user, getToken, setAuth, logout, localUser]);

  return null;
}
