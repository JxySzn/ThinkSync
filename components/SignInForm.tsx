"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Toast style helpers for different types
const baseToastStyle = {
  fontFamily: "Outfit, sans-serif",
  fontWeight: "bold",
  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
};

const errorToastOptions = {
  style: {
    ...baseToastStyle,
    background: "#ff3b3b", // strong red
    color: "#fff",
  },
  duration: 6000,
  action: (
    <button
      onClick={() => toast.dismiss()}
      style={{
        color: "#fff",
        background: "transparent",
        border: "none",
        fontSize: "1.5rem",
        fontWeight: "bold",
        cursor: "pointer",
        marginLeft: "1rem",
        fontFamily: "Outfit, sans-serif",
      }}
      aria-label="Close"
    >
      ×
    </button>
  ),
};

const successToastOptions = {
  style: {
    ...baseToastStyle,
    background: "#22c55e", // strong green
    color: "#fff",
  },
  duration: 6000,
  action: (
    <button
      onClick={() => toast.dismiss()}
      style={{
        color: "#fff",
        background: "transparent",
        border: "none",
        fontSize: "1.5rem",
        fontWeight: "bold",
        cursor: "pointer",
        marginLeft: "1rem",
        fontFamily: "Outfit, sans-serif",
      }}
      aria-label="Close"
    >
      ×
    </button>
  ),
};

const warningToastOptions = {
  style: {
    ...baseToastStyle,
    background: "#facc15", // strong yellow
    color: "#1a1a1a", // dark text for contrast
  },
  duration: 6000,
  action: (
    <button
      onClick={() => toast.dismiss()}
      style={{
        color: "#1a1a1a",
        background: "transparent",
        border: "none",
        fontSize: "1.5rem",
        fontWeight: "bold",
        cursor: "pointer",
        marginLeft: "1rem",
        fontFamily: "Outfit, sans-serif",
      }}
      aria-label="Close"
    >
      ×
    </button>
  ),
};

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        if (data.error === "User not found") {
          toast.error("No account found for this email.", errorToastOptions);
        } else if (data.error === "Invalid credentials") {
          toast.error("Incorrect password.", errorToastOptions);
        } else if (data.error === "Not verified") {
          toast.error(
            "Please verify your email before signing in.",
            warningToastOptions
          );
        } else if (data.error.includes("created with Google or GitHub")) {
          toast.error(
            "Please use the Google or GitHub sign-in button for this account.",
            warningToastOptions
          );
        } else {
          toast.error(data.error || "Sign in failed.", errorToastOptions);
        }
        return;
      }
      toast.success(
        "Sign in successful! Checking permissions...",
        successToastOptions
      );
      // Check if user is admin and redirect accordingly
      try {
        const adminCheck = await fetch("/api/admin/check");
        const adminData = await adminCheck.json();
        setTimeout(() => {
          if (adminData.isAdmin) {
            router.push("/dashboard");
          } else {
            router.push("/home");
          }
        }, 1500);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setTimeout(() => {
          router.push("/home");
        }, 1500);
      }
    } catch {
      toast("Network error. Please try again.", warningToastOptions);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-lg bg-primary/10 p-3">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            Signup For Your ThinkSync Account
          </h1>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Johndoe@gmail.com"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••••••••••"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Sign In
          </Button>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/api/auth/google")}
            type="button"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/api/auth/github")}
            type="button"
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with Github
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button variant="link" asChild>
            <Link href="/sign_up">SignUp</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
