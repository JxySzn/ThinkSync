"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  avatar?: string;
  location?: string;
  bio?: string;
}

// Skeleton component for profile edit form
function ProfileEditSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setFormData({
            fullname: data.user.fullname || "",
            username: data.user.username || "",
            email: data.user.email || "",
            location: data.user.location || "",
            bio: data.user.bio || "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/profile");
      } else {
        alert("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/users/avatar", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        // Refresh user data
        const userRes = await fetch("/api/users");
        const userData = await userRes.json();
        if (userRes.ok && userData.user) {
          setUser(userData.user);
        }
      } else {
        alert("Failed to upload avatar");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileEditSkeleton />;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        User not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullname
                    )}&size=80`
                  }
                  alt={user.fullname}
                />
                <AvatarFallback className="text-2xl">
                  {user.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-input"
                />
                <label
                  htmlFor="avatar-input"
                  className="cursor-pointer text-sm text-primary hover:underline"
                >
                  Change avatar
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium mb-2"
                >
                  Full Name
                </label>
                <Input
                  id="fullname"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-2"
                >
                  Username
                </label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium mb-2"
                >
                  Location
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
