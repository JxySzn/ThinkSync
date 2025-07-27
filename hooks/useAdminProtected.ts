import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/useSession";

export function useAdminProtected() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        router.push("/home");
        return;
      }

      try {
        const response = await fetch("/api/admin/check");
        const data = await response.json();

        if (!data.isAdmin) {
          router.push("/home");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      }
    };

    checkAdminStatus();
  }, [user, loading, router]);

  return { isAdmin, isLoading: loading || !user || !isAdmin };
}
