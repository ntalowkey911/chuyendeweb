"use client";

import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function AuthHydrate() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  // Dùng ref để track trạng thái sync, tránh tạo dependency loop với localUser object
  const syncedClerkIdRef = useRef<string | null>(null);
  const syncedPhoneRef = useRef<string>("");
  const syncedAddressRef = useRef<string>("");

  useEffect(() => {
    if (!isLoaded) return;

    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          if (!token) return;

          // Luôn cập nhật token mới vào storage và zustand
          localStorage.setItem("token", token);
          useAuthStore.setState({ token });

          const currentClerkPhone = (user.unsafeMetadata?.phone as string) || "";
          const currentClerkAddress = (user.unsafeMetadata?.address as string) || "";

          // Chỉ sync nếu chưa sync user này, hoặc metadata thay đổi
          const needsSync =
            syncedClerkIdRef.current !== user.id ||
            syncedPhoneRef.current !== currentClerkPhone ||
            syncedAddressRef.current !== currentClerkAddress;

          if (needsSync) {
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

            // Cập nhật ref sau khi sync thành công
            syncedClerkIdRef.current = user.id;
            syncedPhoneRef.current = currentClerkPhone;
            syncedAddressRef.current = currentClerkAddress;
          }
        } catch (e) {
          console.error("Sync failed", e);
        }
      } else if (!isSignedIn) {
        // Chỉ logout nếu trước đó đã sync (có user)
        if (syncedClerkIdRef.current !== null) {
          logout();
          syncedClerkIdRef.current = null;
          syncedPhoneRef.current = "";
          syncedAddressRef.current = "";
        }
      }
    };

    void syncUser();
    // KHÔNG đưa localUser/setAuth/logout vào dependency để tránh vòng lặp vô hạn
    // setAuth và logout là Zustand actions, stable reference nhưng ESLint không biết
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isLoaded, user?.id, user?.unsafeMetadata?.phone, user?.unsafeMetadata?.address]);

  return null;
}
