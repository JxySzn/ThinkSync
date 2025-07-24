"use client";
import { useState, useEffect } from "react";
import BlogPostCard from "@/components/BlogPostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    fullname: string;
    avatar?: string;
  };
  tags: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  likes?: string[];
  isDraft?: boolean;
  commentCount?: number;
  shareCount?: number;
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
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2 border-t">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (res.ok && data.posts) {
        setPosts(data.posts);
      } else {
        setError("Failed to fetch posts");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchPosts} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogPostSkeleton key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">
                Be the first to share your research and insights with the
                community.
              </p>
              <Button onClick={() => (window.location.href = "/create")}>
                Create Your First Post
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <BlogPostCard
                  post={{
                    ...post,
                    likes: post.likes || [],
                    commentCount: post.commentCount || 0,
                    shareCount: post.shareCount || 0,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
