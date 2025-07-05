"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSignupFlow } from "./useSignupFlow";

export function SignUpVerificationForm({
  className,
  showLeaveAlert: showLeaveAlertProp,
  setShowLeaveAlert: setShowLeaveAlertProp,
  ...props
}: React.ComponentProps<"form"> & {
  showLeaveAlert?: boolean;
  setShowLeaveAlert?: (v: boolean) => void;
}) {
  const router = useRouter();
  const { email } = useSignupFlow();
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [internalShowLeaveAlert, setInternalShowLeaveAlert] = useState(false);
  const showLeaveAlert = showLeaveAlertProp ?? internalShowLeaveAlert;
  const setShowLeaveAlert = setShowLeaveAlertProp ?? setInternalShowLeaveAlert;

  // Navigation guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You will lose your progress and have to start again.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Intercept navigation (e.g., browser back)
  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      e.preventDefault?.();
      setShowLeaveAlert(true);
      window.history.pushState(null, "", window.location.href); // Prevent back
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [setShowLeaveAlert]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value: string) => setOtp(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Signup session expired. Please start again.");
        router.push("/sign_up");
        return;
      }
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "OTP verification failed.");
        return;
      }
      toast.success("OTP verified! Proceed to set your username.");
      router.push(`/sign_up_user_name?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;
    try {
      if (!email) {
        toast.error("Signup session expired. Please start again.");
        router.push("/sign_up");
        return;
      }
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(`Resend error: ${data.error || "Failed to resend OTP."}`, {
          icon: "❌",
          style: { background: "#fee2e2", color: "#b91c1c" },
        });
        return;
      }
      toast.success("A new OTP has been sent to your email!", {
        icon: "✉️",
        style: { background: "#dcfce7", color: "#166534" },
      });
      setResendCooldown(60);
    } catch (error) {
      toast.error(
        `Network error: ${error instanceof Error ? error.message : error}`,
        {
          icon: "🌐",
          style: { background: "#fef9c3", color: "#b45309" },
        }
      );
    }
  }, [resendCooldown, email, router]);

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-lg bg-primary/10 p-3">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Verification Code</h1>
          <p className="text-muted-foreground text-sm">
            Enter your 6 digit verification Code sent to your email
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
          <InputOTPGroup className="space-x-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="rounded-md border-l border-accent/90 shadow-inner dark:shadow-primary/10"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button type="submit" className="w-full" disabled={otp.length !== 6}>
        Verify
      </Button>
      <div className="text-center text-sm">
        Didn&apos;t recieve a code?{" "}
        <button
          type="button"
          className="text-primary underline-offset-4 hover:underline font-medium disabled:opacity-50"
          onClick={handleResend}
          disabled={resendCooldown > 0}
        >
          {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
        </button>
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
