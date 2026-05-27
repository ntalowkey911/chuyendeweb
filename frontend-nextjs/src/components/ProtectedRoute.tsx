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
  const { user, hydrate, isAdmin } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (adminOnly && !isAdmin()) {
      router.replace("/");
    }
  }, [user, adminOnly, isAdmin, router]);

  if (!user || (adminOnly && !isAdmin())) {
    return <p className="p-8 text-center">Đang kiểm tra quyền...</p>;
  }

  return <>{children}</>;
}
