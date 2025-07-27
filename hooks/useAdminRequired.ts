"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/useSession";

export function useAdminRequired() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/home");
    }
  }, [user, loading, router]);

  return { isLoading: loading, isAdmin: user?.role === "admin" };
}
