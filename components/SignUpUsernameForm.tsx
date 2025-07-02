import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignupFlow } from "./useSignupFlow";

export function SignUpUsernameForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email } = useSignupFlow();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);

  // Navigation guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You will lose your progress and have to start again.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Intercept navigation (e.g., back arrow, Link)
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setShowLeaveAlert(true);
    };
    // TODO: Add logic to intercept Link clicks if needed
    return () => {};
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userEmail = email || searchParams.get("email");
      if (!userEmail) {
        toast.error("Signup session expired. Please start again.");
        router.push("/sign_up");
        return;
      }
      const res = await fetch("/api/auth/set-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, username }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to set username.");
        setLoading(false);
        return;
      }
      toast.success("Account created! You can now sign in.");
      router.push("/sign_in");
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <UserRound className="h-12 w-12 text-primary" />
        </div>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="John_doe1"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !username}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
      {showLeaveAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-xl max-w-sm w-full">
            <h2 className="font-bold mb-2">Leave authentication?</h2>
            <p className="mb-4">
              You will lose your progress and have to start again.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowLeaveAlert(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowLeaveAlert(false);
                  router.push("/");
                }}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
