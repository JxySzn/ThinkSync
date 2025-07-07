"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Repeat2,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
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

export default function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const [followersSearch, setFollowersSearch] = useState("");
  const [followingSearch, setFollowingSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading || !user) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  // Followers and following are arrays of user objects or IDs
  const followers = user.followers || [];
  const following = user.following || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="relative">
        {/* Cover Photo Area */}
        <div className="h-48 bg-muted"></div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
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

            <Button variant="outline" className="mt-16 bg-transparent">
              <Link href="/profile/edit">Edit profile</Link>
            </Button>
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
                    {/* If following is array of user IDs, you may want to fetch user details for each. For now, just show IDs. */}
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
                                src={f.avatar || "/placeholder.svg"}
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
                            Following
                          </Button>
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
                                src={f.avatar || "/placeholder.svg"}
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
              {[
                { value: "posts", label: "Posts" },
                { value: "replies", label: "Replies" },
                { value: "highlights", label: "Highlights" },
                { value: "articles", label: "Articles" },
                { value: "media", label: "Media" },
                { value: "likes", label: "Likes" },
              ].map((tab) => (
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
          <div className="divide-y divide-border">
            {/* Repost */}
            <Card className="rounded-none border-0 border-b">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Repeat2 className="w-4 h-4" />
                  <span>You reposted</span>
                </div>

                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="CHRISTJIL"
                    />
                    <AvatarFallback>CJ</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold">CHRISTJIL</span>
                      <Badge variant="secondary" className="text-xs">
                        🇳🇬
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        @christjil_gh
                      </span>
                      <span className="text-muted-foreground text-sm">·</span>
                      <span className="text-muted-foreground text-sm">
                        Apr 23, 2024
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="font-semibold mb-2">
                        6 reasons why you should trust God:
                      </p>
                      <div className="space-y-1">
                        <p>• He knows you by name.</p>
                        <p className="text-muted-foreground ml-4">
                          Isaiah 43:1
                        </p>
                        <p>• He will fight for you.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="replies">
          <div className="p-8 text-center text-muted-foreground">
            <p>No replies yet</p>
          </div>
        </TabsContent>

        <TabsContent value="highlights">
          <div className="p-8 text-center text-muted-foreground">
            <p>No highlights yet</p>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="p-8 text-center text-muted-foreground">
            <p>No articles yet</p>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <div className="p-8 text-center text-muted-foreground">
            <p>No media yet</p>
          </div>
        </TabsContent>

        <TabsContent value="likes">
          <div className="p-8 text-center text-muted-foreground">
            <p>No likes yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
