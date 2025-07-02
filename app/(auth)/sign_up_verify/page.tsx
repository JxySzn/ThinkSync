"use client";
import { SignUpVerificationForm } from "@/components/SignUpVerificationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLeaveAlert(true);
  };
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

      {/* RightSide */}
      <div className="flex flex-col gap-4 p-0 md:p-0">
        {/* 
          For small screens: align to top with pt-10 
          For md and up: center vertically (items-center) and remove extra top padding
        */}
        <div className="flex flex-1 items-center justify-center">
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
