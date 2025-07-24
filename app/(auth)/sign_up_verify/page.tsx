"use client";
import { useEffect, useState } from "react";
import { SignUpVerificationForm } from "@/components/SignUpVerificationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLeaveAlert(true);
  };

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
    <div className="relative grid min-h-svh lg:grid-cols-2">
      {/* Back Arrow for all screen sizes */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center justify-center lg:top-8 lg:left-8"
        onClick={handleBack}
      >
        <ArrowLeft
          className="text-primary lg:text-background"
          width={30}
          height={30}
        />
      </Link>

      {/* LeftSide (only visible on large screens) */}
      <div className="bg-primary hidden lg:block"></div>

      {/* Right Side (with animation on md and smaller screens) */}
      <div className="flex flex-col gap-4 p-0 md:p-0 relative w-full h-full overflow-hidden">
        {/* Only show on md and smaller screens */}
        <canvas
          id="constellation-canvas-right"
          className="absolute inset-0 w-full h-full block lg:hidden"
          style={{ pointerEvents: "none" }}
        />
        <div className="flex flex-1 items-center justify-center relative z-10">
          <div className="w-full max-w-xs">
            <SignUpVerificationForm
              showLeaveAlert={showLeaveAlert}
              setShowLeaveAlert={setShowLeaveAlert}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
