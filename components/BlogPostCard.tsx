"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, Share2, MessageCircle } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface BlogPostCardProps {
  post: {
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
    likes: string[];
    isDraft?: boolean;
    commentCount: number;
    shareCount: number;
  };
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} alt={post.author.fullname} />
          <AvatarFallback>{post.author.fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{post.author.fullname}</p>
          <p className="text-sm text-gray-500">@{post.author.username}</p>
        </div>
        <p className="ml-auto text-sm text-gray-500">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </CardHeader>

      {post.coverImage && (
        <div className="relative w-full aspect-video">
          <Image
            src={post.coverImage}
            alt="Blog post image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700">{post.content}</p>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-sm text-blue-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between p-4 border-t">
        <div className="flex gap-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{post.likes.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageCircle className="h-5 w-5" />
            <span>{post.commentCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share2 className="h-5 w-5" />
            <span>{post.shareCount}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
