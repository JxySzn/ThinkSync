"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import BlogPostCard from "@/components/BlogPostCard";

interface User {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  location?: string;
  joinDate?: string;
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
  likes: string[];
  isDraft?: boolean;
  commentCount: number;
  shareCount: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const router = useRouter();

  // Function to handle starting a chat with the user
  const handleStartChat = () => {
    if (!user) return;
    // Create chat URL with user info
    const chatUrl = `/messages?user=${user.username}&name=${
      user.fullname || user.username
    }&avatar=${user.avatar || ""}`;
    router.push(chatUrl);
  };

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-6">
        <Avatar className="w-32 h-32">
          <AvatarImage
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.fullname
              )}&size=128`
            }
            alt={user.fullname}
          />
          <AvatarFallback>
            {user.fullname
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h1 className="text-2xl font-bold">{user.fullname}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <div className="flex gap-4 text-muted-foreground">
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

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleStartChat}
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="grid gap-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => <BlogPostCard key={post._id} post={post} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No media yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
