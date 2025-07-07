"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  verified: boolean;
  avatar?: string;
  location?: string;
  joinDate?: string;
  online?: boolean;
  followers?: string[];
  following?: string[];
  website?: string;
  bio?: string;
  birthDate?: string;
}

interface Session {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useSession() {
  const [session, setSession] = useState<Session>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (response.ok && data.user) {
        setSession({
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        setSession({
          user: null,
          loading: false,
          error: data.error || "Not authenticated",
        });
      }
    } catch {
      setSession({
        user: null,
        loading: false,
        error: "Network error",
      });
    }
  };

  const signOut = async () => {
    try {
      // Clear the token cookie by setting it to expire
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setSession({
        user: null,
        loading: false,
        error: null,
      });

      router.push("/");
    } catch {
      console.error("Error signing out");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user: session.user,
    loading: session.loading,
    error: session.error,
    signOut,
    refetch: fetchUser,
  };
}
