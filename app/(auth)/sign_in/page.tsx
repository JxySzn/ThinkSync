import { ArrowLeft } from "lucide-react";
import { SignInForm } from "@/components/SignInForm";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      {/* Responsive Back Arrow (visible on all screen sizes) */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center justify-center lg:top-8 lg:left-8"
      >
        <ArrowLeft
          className="text-primary lg:text-background"
          width={30}
          height={30}
        />
      </Link>

      {/* LeftSide (only visible on large screens) */}
      <div className="bg-primary hidden lg:block"></div>

      {/* Right Side */}
      <div className="flex flex-col gap-4 p-0 md:p-0">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
