"use client";

import { useAdminRequired } from "@/hooks/useAdminRequired";

export default function AdminDashboard() {
  const { isLoading, isAdmin } = useAdminRequired();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The hook will handle redirection
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}
