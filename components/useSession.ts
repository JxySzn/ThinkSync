"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
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
  id?: string; // For backwards compatibility with some components
  role: "admin" | "user";
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
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include", // Important: include credentials to ensure cookies are sent
      });

      if (response.ok) {
        // Clear local state
        setSession({
          user: null,
          loading: false,
          error: null,
        });

        // Redirect to home page
        router.push("/");
        router.refresh(); // Force a router refresh to update the UI
      } else {
        console.error("Error signing out:", await response.text());
      }
    } catch (error) {
      console.error("Error signing out:", error);
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
