"use client";

import { Suspense, useEffect } from "react";
import { SignUpUsernameForm } from "@/components/SignUpUsernameForm";
import { Skeleton } from "@/components/ui/skeleton";
function SignUpUsernameSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function Page() {
  useEffect(() => {
    function animateConstellations(canvasId: string) {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      resize();

      const STAR_COUNT = 60;
      const stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
      }));

      function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        for (const star of stars) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const a = stars[i],
              b = stars[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      function update() {
        for (const star of stars) {
          star.x += star.dx;
          star.y += star.dy;
          if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
          if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
        }
      }

      function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
      }
      loop();

      window.addEventListener("resize", resize);
    }
    animateConstellations("constellation-canvas-right");
  }, []);

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          ThinkSync
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has revolutionized how I collaborate with
              researchers worldwide. The seamless integration and real-time
              features make it indispensable for academic work.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 relative w-full h-full overflow-hidden">
        {/* Only show on md and smaller screens */}
        <canvas
          id="constellation-canvas-right"
          className="absolute inset-0 w-full h-full block lg:hidden"
          style={{ pointerEvents: "none" }}
        />
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] relative z-10">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Choose your username
            </h1>
            <p className="text-sm text-muted-foreground">
              This will be your unique identifier on the platform
            </p>
          </div>
          <Suspense fallback={<SignUpUsernameSkeleton />}>
            <SignUpUsernameForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
