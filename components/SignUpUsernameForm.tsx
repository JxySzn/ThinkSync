"use client";
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignupFlow } from "./useSignupFlow";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [isGenerating, setIsGenerating] = useState(false);

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
    const handler = (e: PopStateEvent) => {
      e.preventDefault();
      setShowLeaveAlert(true);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [setShowLeaveAlert]);

  // Generate initial username when component mounts
  useEffect(() => {
    const generateInitialUsername = async () => {
      const userEmail = email || searchParams.get("email");
      if (userEmail && !username) {
        await generateRandomUsername(userEmail);
      }
    };
    generateInitialUsername();
  }, [email, searchParams, username]);

  // Check username availability with debouncing
  const checkUsernameAvailability = useCallback(
    async (usernameToCheck: string) => {
      if (!usernameToCheck || usernameToCheck.length < 3) {
        setUsernameStatus("idle");
        return;
      }

      setUsernameStatus("checking");

      try {
        const response = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: usernameToCheck }),
        });

        const data = await response.json();

        if (response.ok) {
          setUsernameStatus(data.available ? "available" : "taken");
        } else {
          setUsernameStatus("idle");
        }
      } catch {
        console.error("Error checking username");
        setUsernameStatus("idle");
      }
    },
    []
  );

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username);
      } else {
        setUsernameStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, checkUsernameAvailability]);

  const generateRandomUsername = async (userEmail: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/auth/generate-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok && data.username) {
        setUsername(data.username);
        setUsernameStatus("available");
      } else {
        toast.error("Failed to generate username. Please try again.");
      }
    } catch {
      console.error("Error generating username");
      toast.error("Failed to generate username. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
    } catch {
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
          <div className="relative">
            <Input
              id="username"
              type="text"
              placeholder="John_doe1"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className={cn(
                "pr-10",
                usernameStatus === "available" &&
                  "border-green-500 focus:border-green-500",
                usernameStatus === "taken" &&
                  "border-red-500 focus:border-red-500"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "checking" && (
                <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
              )}
              {usernameStatus === "available" && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {usernameStatus === "taken" && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          {usernameStatus === "available" && (
            <p className="text-sm text-green-600">Username is available!</p>
          )}
          {usernameStatus === "taken" && (
            <p className="text-sm text-red-600">Username is already taken</p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const userEmail = email || searchParams.get("email");
              if (userEmail) {
                generateRandomUsername(userEmail);
              }
            }}
            disabled={isGenerating || loading}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate New Username"
            )}
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !username || usernameStatus !== "available"}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
      <AlertDialog open={showLeaveAlert} onOpenChange={setShowLeaveAlert}>
        <AlertDialogContent>
          <AlertDialogTitle>Leave authentication?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose your progress and have to start again.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLeaveAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowLeaveAlert(false);
                router.push("/");
              }}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
