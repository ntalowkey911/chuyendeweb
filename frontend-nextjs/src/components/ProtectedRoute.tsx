"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly }: Props) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (adminOnly && !isAdmin()) {
      router.replace("/");
    }
  }, [adminOnly, hydrated, isAdmin, router, user]);

  if (!hydrated) {
    return <p className="p-8 text-center">Đang kiểm tra quyền...</p>;
  }

  if (!user || (adminOnly && !isAdmin())) {
    return <p className="p-8 text-center">Đang chuyển trang...</p>;
  }

  return <>{children}</>;
}
