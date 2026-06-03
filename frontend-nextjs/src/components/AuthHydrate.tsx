"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function AuthHydrate() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { setAuth, logout, user: localUser } = useAuthStore();

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          if (token) {
            // Luôn cập nhật token mới vào storage và zustand
            localStorage.setItem("token", token);
            useAuthStore.setState({ token });

            const currentClerkPhone = (user.unsafeMetadata?.phone as string) || "";
            const currentClerkAddress = (user.unsafeMetadata?.address as string) || "";

            // Đồng bộ nếu chưa có localUser hoặc thông tin metadata trên Clerk bị thay đổi so với local
            if (!localUser || localUser.phone !== currentClerkPhone || localUser.address !== currentClerkAddress) {
              const res = await authService.syncClerk({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                fullName: user.fullName || "",
                avatarUrl: user.imageUrl || "",
                phone: currentClerkPhone,
                address: currentClerkAddress
              }, token);
              
              setAuth({
                userId: res.data.id,
                fullName: res.data.fullName,
                email: res.data.email,
                role: res.data.role,
                phone: res.data.phone,
                address: res.data.address,
                token: token
              });
            }
          }
        } catch (e) {
          console.error("Sync failed", e);
        }
      } else if (isLoaded && !isSignedIn && localUser) {
        logout();
      }
    };
    syncUser();
  }, [isSignedIn, isLoaded, user, getToken, setAuth, logout, localUser]);

  return null;
}
