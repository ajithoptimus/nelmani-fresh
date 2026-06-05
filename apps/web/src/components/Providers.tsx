"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    // Restore auth state on app load
    fetchMe();

    // Listen for auth logout events (triggered by API interceptor on 401)
    const handleLogout = () => {
      useAuthStore.getState().logout();
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [fetchMe]);

  return <>{children}</>;
}
