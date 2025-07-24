"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, User, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogPostCard from "@/components/BlogPostCard";
import { useSearchParams } from "next/navigation";

interface User {
  _id: string;
  fullname: string;
  username: string;
  avatar?: string;
  location?: string;
  joinDate?: string;
  followers?: User[];
  following?: User[];
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  likes: string[];
  commentCount: number;
  shareCount: number;
  coverImage?: string;
  isDraft?: boolean;
}

// Skeleton component for user search results
function UserSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="w-20 h-9 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function PostSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function SearchContent() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Get search query from URL using the useSearchParams hook
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        // Search users
        const usersRes = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}`
        );
        const usersData = await usersRes.json();

        // Search posts
        const postsRes = await fetch(
          `/api/blog/search?q=${encodeURIComponent(query)}`
        );
        const postsData = await postsRes.json();

        if (usersRes.ok) {
          setUsers(usersData.users || []);
        }

        if (postsRes.ok) {
          setPosts(postsData.posts || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        setUsers([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className={
            activeTab === "users"
              ? "space-y-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {Array.from({ length: 5 }).map((_, index) =>
            activeTab === "users" ? (
              <UserSkeleton key={index} />
            ) : (
              <PostSkeleton key={index} />
            )
          )}
        </div>
      );
    }

    if (!query) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No search query</h3>
            <p className="text-muted-foreground">
              Use the search bar in the navigation to search for users and
              posts.
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === "users") {
      if (users.length === 0) {
        return (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or check the spelling.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {users.length} user{users.length !== 1 ? "s" : ""}
          </p>
          {users.map((user) => (
            <Card key={user._id} className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.fullname
                        )}&size=48`
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

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{user.fullname}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      @{user.username}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      {user.joinDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Joined{" "}
                            {new Date(user.joinDate).toLocaleDateString(
                              "default",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/profile/${user.username}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else {
      if (posts.length === 0) {
        return (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or check the spelling.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="w-full">
              <BlogPostCard post={post} />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-0 bg-transparent">
            <div className="flex w-full border-b border-border">
              <TabsTrigger
                value="users"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary hover:bg-muted/50 py-4"
              >
                Users {users.length > 0 && `(${users.length})`}
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary hover:bg-muted/50 py-4"
              >
                Posts {posts.length > 0 && `(${posts.length})`}
              </TabsTrigger>
            </div>
          </TabsList>

          {/* Content */}
          <div className="mt-6">{renderContent()}</div>
        </Tabs>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
