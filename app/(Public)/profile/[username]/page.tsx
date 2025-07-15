"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/components/useUserStore";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  type UserType = {
    _id?: string;
    username: string;
    fullname?: string;
    avatar?: string;
    online?: boolean;
    location?: string;
    joinDate?: string;
    followers?: Array<UserType | string>;
    following?: Array<UserType | string>;
  };
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    user: currentUser,
    setUser: setCurrentUser,
    updateFollowing,
  } = useUserStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(username)}`);
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          // Check if current user is following this user
          if (currentUser && data.user.followers) {
            setIsFollowing(
              (data.user.followers as Array<UserType | string>).some(
                (f) =>
                  (typeof f === "object" &&
                    f.username === currentUser.username) ||
                  f === currentUser.username ||
                  (typeof f === "object" && f._id === currentUser._id) ||
                  f === currentUser._id
              )
            );
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }
    if (username) fetchUser();
  }, [username, currentUser]);

  // Fetch current user if not already
  useEffect(() => {
    async function fetchCurrentUser() {
      if (!currentUser) {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && data.user) setCurrentUser(data.user);
      }
    }
    fetchCurrentUser();
  }, [currentUser, setCurrentUser]);

  if (loading || !user) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  // Followers and following are arrays of user objects or IDs
  const following = user.following || [];

  const handleFollow = async () => {
    if (!currentUser) return;
    setIsFollowing(true);
    setUser((prev) =>
      prev
        ? {
            ...prev,
            followers: [
              ...(prev.followers || []),
              {
                _id: currentUser._id,
                username: currentUser.username,
                fullname: currentUser.fullname,
                avatar: currentUser.avatar,
                online: currentUser.online,
                location: currentUser.location,
                joinDate: currentUser.joinDate,
              } as UserType,
            ],
          }
        : prev
    );
    updateFollowing(username, true);
    await fetch(`/api/users/${encodeURIComponent(username)}/follow`, {
      method: "POST",
    });
  };

  const handleUnfollow = async () => {
    if (!currentUser) return;
    setIsFollowing(false);
    setUser((prev) =>
      prev
        ? {
            ...prev,
            followers: (prev.followers || []).filter(
              (f) =>
                typeof f === "object" &&
                f.username !== currentUser.username &&
                (typeof f === "string" ? f !== currentUser.username : true) &&
                typeof f === "object" &&
                f._id !== currentUser._id &&
                (typeof f === "string" ? f !== currentUser._id : true)
            ),
          }
        : prev
    );
    updateFollowing(username, false);
    await fetch(`/api/users/${encodeURIComponent(username)}/follow`, {
      method: "DELETE",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="relative">
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start mt-8 mb-4 gap-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background overflow-hidden">
                <Image
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullname || "User"
                    )}&size=128`
                  }
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="128px"
                  priority
                />
                <span className="text-2xl absolute inset-0 flex items-center justify-center">
                  {user.fullname
                    ? user.fullname
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    : "U"}
                </span>
              </Avatar>
              {/* Online indicator */}
              {user.online && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>

            {/* Buttons for large screens */}
            <div className="hidden sm:flex gap-2 mt-16">
              <button
                className={`bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90`}
                onClick={isFollowing ? handleUnfollow : handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <Button
                variant="secondary"
                onClick={() => router.push(`/messages?user=${user.username}`)}
              >
                Message
              </Button>
            </div>
          </div>

          {/* Name and Username */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{user.fullname}</h1>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          {/* Location and Join Date */}
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
            {user.location && (
              <div className="flex items-center gap-1">
                <span>{user.location}</span>
              </div>
            )}
            {user.joinDate && (
              <div className="flex items-center gap-1">
                <span>
                  Joined{" "}
                  {new Date(user.joinDate).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Following/Followers */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mb-4 items-start sm:items-center">
            <div className="flex gap-2">
              <span className="font-bold text-foreground">
                {following.length}
              </span>
              <span className="text-muted-foreground">Following</span>
              <span className="font-bold text-foreground">
                {user.followers?.length || 0}
              </span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            {/* Buttons for small screens */}
            <div className="flex gap-2 w-full sm:hidden">
              <button
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                onClick={isFollowing ? handleUnfollow : handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full border-b border-border">
        <div className="flex w-full">
          {[
            { value: "posts", label: "Posts" },
            { value: "replies", label: "Replies" },
            { value: "highlights", label: "Highlights" },
            { value: "articles", label: "Articles" },
            { value: "media", label: "Media" },
            { value: "likes", label: "Likes" },
          ].map((tab) => (
            <button
              key={tab.value}
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary hover:bg-muted/50 py-4"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Example Posts Section */}
      <div className="divide-y divide-border">
        <Card className="rounded-none border-0 border-b">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <span>You reposted</span>
            </div>
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    "CHRISTJIL"
                  )}&size=40`}
                  alt="CHRISTJIL"
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                  sizes="40px"
                  priority={false}
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">CHRISTJIL</span>
                  <span className="text-muted-foreground text-sm">
                    @christjil_gh
                  </span>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-muted-foreground text-sm">
                    Apr 23, 2024
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold mb-2">
                    6 reasons why you should trust God:
                  </p>
                  <div className="space-y-1">
                    <p>• He knows you by name.</p>
                    <p className="text-muted-foreground ml-4">Isaiah 43:1</p>
                    <p>• He will fight for you.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
