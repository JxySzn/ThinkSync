"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/useSession";
import BlogPostCard from "@/components/BlogPostCard";
import { toast } from "sonner";

interface User {
  _id?: string;
  id?: string;
  fullname?: string;
  username?: string;
  avatar?: string;
  location?: string;
  joinDate?: string;
  online?: boolean;
  followers?: User[];
  following?: User[];
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  likes?: string[];
  isDraft?: boolean;
  commentCount?: number;
  shareCount?: number;
}

// Skeleton component for profile header
function ProfileHeaderSkeleton() {
  return (
    <div className="px-4 pb-4">
      <div className="flex justify-between items-start mt-8 mb-4">
        <div className="relative">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        <Skeleton className="w-24 h-10 rounded" />
      </div>
      <div className="mb-3">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-4 mb-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// Skeleton component for blog post cards
function BlogPostSkeleton() {
  return (
    <Card className="w-full bg-card text-card-foreground border-border rounded-lg overflow-hidden">
      <div className="p-0">
        <Skeleton className="w-full aspect-[2/1]" />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  );
}

export default function UsernameProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState("posts");
  const [followersSearch, setFollowersSearch] = useState("");
  const [followingSearch, setFollowingSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser } = useSession();
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
              data.user.followers.some((f: User) => f._id === currentUser._id)
            );
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username, currentUser]);

  useEffect(() => {
    async function fetchPosts() {
      if (!user?.username) return;
      try {
        const res = await fetch(
          `/api/blog?author=${encodeURIComponent(user.username)}`
        );
        const data = await res.json();
        if (res.ok && data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, [user]);

  const handleFollowToggle = async () => {
    if (!currentUser || !user) return;

    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: user._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsFollowing(data.following);
        toast(data.following ? "Followed" : "Unfollowed", {
          description: `You have ${
            data.following ? "followed" : "unfollowed"
          } @${user.username}`,
          icon: user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username || ""}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white">
              {(user.fullname || "U")[0]}
            </div>
          ),
        });
        // Update followers count immediately in the UI
        setUser((prev) => {
          if (!prev) return null;
          const followersUpdate = data.following
            ? [
                ...(prev.followers || []),
                {
                  _id: currentUser._id,
                  fullname: currentUser.fullname,
                  username: currentUser.username,
                  avatar: currentUser.avatar,
                  location: currentUser.location,
                  online: currentUser.online,
                } as User,
              ]
            : (prev.followers || []).filter((f) => f._id !== currentUser._id);

          return {
            ...prev,
            followers: followersUpdate,
          };
        });
      }
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
    }
  };

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser?.username === user?.username;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="relative">
          <ProfileHeaderSkeleton />
        </div>
        <Tabs value="posts" className="w-full">
          <div className="border-b border-border">
            <TabsList className="w-full h-auto p-0 bg-transparent">
              <div className="flex w-full">
                <TabsTrigger
                  value="posts"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary hover:bg-muted/50 py-4"
                >
                  Posts
                </TabsTrigger>
              </div>
            </TabsList>
          </div>
          <TabsContent value="posts" className="mt-0">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <BlogPostSkeleton key={index} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        User not found
      </div>
    );
  }

  // Followers and following are arrays of user objects or IDs
  const followers = user.followers || [];
  const following = user.following || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="relative">
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start mt-8 mb-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background overflow-hidden">
                <AvatarImage
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullname || "User"
                    )}&size=128`
                  }
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="text-2xl">
                  {user.fullname
                    ? user.fullname
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              {user.online && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>

            {isOwnProfile ? (
              <Button variant="outline" className="mt-16 bg-transparent">
                <Link href="/profile/edit">Edit profile</Link>
              </Button>
            ) : (
              <div className="flex gap-2 mt-16">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/messages?user=${user.username}`)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            )}
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
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.joinDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
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
          <div className="flex gap-4 text-sm mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1 hover:underline">
                  <span className="font-bold text-foreground">
                    {following.length}
                  </span>
                  <span className="text-muted-foreground">Following</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[600px]">
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search following..."
                      value={followingSearch}
                      onChange={(e) => setFollowingSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {following.length === 0 && (
                      <div className="text-center text-muted-foreground">
                        No following yet
                      </div>
                    )}
                    {following
                      .filter((f: User) =>
                        typeof f === "object"
                          ? f.fullname
                              ?.toLowerCase()
                              .includes(followingSearch.toLowerCase()) ||
                            f.username
                              ?.toLowerCase()
                              .includes(followingSearch.toLowerCase())
                          : true
                      )
                      .map((f: User, i: number) => (
                        <div
                          key={f._id || f.id || i}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={
                                  f.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    f.fullname || f.username || "User"
                                  )}&size=40`
                                }
                                alt={f.fullname || f.username || "User"}
                              />
                              <AvatarFallback>
                                {(f.fullname || f.username || "U").charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-semibold text-sm">
                                  {f.fullname || f.username || "User"}
                                </p>
                              </div>
                              <p className="text-muted-foreground text-xs">
                                @{f.username || "user"}
                              </p>
                            </div>
                          </div>
                          <Link href={`/profile/${f.username}`}>
                            <Button variant="outline" size="sm">
                              {currentUser?._id === f._id
                                ? "You"
                                : "View Profile"}
                            </Button>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1 hover:underline">
                  <span className="font-bold text-foreground">
                    {followers.length}
                  </span>
                  <span className="text-muted-foreground">Followers</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[600px]">
                <DialogHeader>
                  <DialogTitle>Followers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search followers..."
                      value={followersSearch}
                      onChange={(e) => setFollowersSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {followers.length === 0 && (
                      <div className="text-center text-muted-foreground">
                        No followers yet
                      </div>
                    )}
                    {followers
                      .filter((f: User) =>
                        typeof f === "object"
                          ? f.fullname
                              ?.toLowerCase()
                              .includes(followersSearch.toLowerCase()) ||
                            f.username
                              ?.toLowerCase()
                              .includes(followersSearch.toLowerCase())
                          : true
                      )
                      .map((f: User, i: number) => (
                        <div
                          key={f._id || f.id || i}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={
                                  f.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    f.fullname || f.username || "User"
                                  )}&size=40`
                                }
                                alt={f.fullname || f.username || "User"}
                              />
                              <AvatarFallback>
                                {(f.fullname || f.username || "U").charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-semibold text-sm">
                                  {f.fullname || f.username || "User"}
                                </p>
                              </div>
                              <p className="text-muted-foreground text-xs">
                                @{f.username || "user"}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border">
          <TabsList className="w-full h-auto p-0 bg-transparent">
            <div className="flex w-full">
              {[{ value: "posts", label: "Posts" }].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary hover:bg-muted/50 py-4"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
        </div>

        <TabsContent value="posts" className="mt-0">
          <div className="p-6">
            {posts.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p>No posts yet.</p>
                {isOwnProfile && (
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/create")}
                  >
                    Create your first post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => router.push(`/blog/${post._id}`)}
                    className="cursor-pointer"
                  >
                    <BlogPostCard
                      post={{
                        ...post,
                        author: {
                          username: post.author?.username || "unknown",
                          fullname: post.author?.fullname || "Unknown User",
                          avatar: post.author?.avatar,
                        },
                        likes: post.likes || [],
                        isDraft: post.isDraft || false,
                        commentCount: post.commentCount || 0,
                        shareCount: post.shareCount || 0,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
