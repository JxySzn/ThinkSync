"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, MapPin, Link, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/useSession";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export default function Page() {
  const router = useRouter();
  const { refetch } = useSession();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    birthDate: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && data.user) {
          setFormData({
            fullname: data.user.fullname || "",
            username: data.user.username || "",
            bio: data.user.bio || "",
            location: data.user.location || "",
            website: data.user.website || "",
            birthDate: data.user.birthDate
              ? data.user.birthDate.slice(0, 10)
              : "",
            avatar: data.user.avatar || "",
          });
          setAvatarPreview(
            data.user.avatar || "/placeholder.svg?height=128&width=128"
          );
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      try {
        const url = await uploadToCloudinary(file, "avatars");
        setFormData((prev) => ({ ...prev, avatar: url }));
      } catch {
        alert("Failed to upload avatar");
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: formData.fullname,
          username: formData.username,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          birthDate: formData.birthDate,
          avatar: formData.avatar,
        }),
      });
      if (res.ok) {
        if (refetch) {
          refetch();
        }
        router.push("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Edit profile</h1>
              <p className="text-sm text-muted-foreground">
                @{formData.username}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="px-4 flex justify-center mt-8 mb-8">
        <div className="relative inline-block">
          <Avatar className="w-32 h-32 border-4 border-background overflow-hidden">
            <AvatarImage
              src={avatarPreview || "/placeholder.svg"}
              alt="Profile"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
            <AvatarFallback className="text-2xl">JS</AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 cursor-pointer"
          >
            <div className="w-full h-full bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          {/* Online indicator */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={formData.fullname}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
                placeholder="Your display name"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {formData.fullname.length}/50
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="username"
                  className="pl-8"
                  maxLength={30}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.username.length}/30
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[100px] resize-none"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/160
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Where are you located?"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="pl-10"
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  type="date"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This won&apos;t be shown publicly. It helps us show you relevant
                content and ads.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
