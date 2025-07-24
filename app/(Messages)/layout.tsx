"use client";

import "../globals.css";
import IconRail from "@/components/MessageIconRail";
import Sidebar from "@/components/MessageSidebar";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface MessagesLayoutProps {
  children: React.ReactNode;
}

function MessagesContent({ children }: MessagesLayoutProps) {
  const searchParams = useSearchParams();
  const newChatUser = searchParams.get("user");
  const newChatName = searchParams.get("name");
  const newChatAvatar = searchParams.get("avatar");

  const [chats, setChats] = useState<
    Array<{
      id: string;
      name: string;
      last: string;
      avatar?: string;
      username?: string;
    }>
  >([]);

  useEffect(() => {
    if (newChatUser && newChatName) {
      const userChat = {
        id: `new-${Date.now()}`,
        username: newChatUser,
        name: newChatName,
        last: "Start a conversation",
        avatar: newChatAvatar || undefined,
      };

      if (!chats.some((chat) => chat.username === newChatUser)) {
        setChats((prev) => [userChat, ...prev]);
      }
    }
  }, [newChatUser, newChatName, newChatAvatar, chats]);

  return (
    <div className="flex h-screen bg-background">
      {/* Slim icon rail */}
      <nav className="w-16 border-r border-border flex flex-col items-center py-4 space-y-4">
        <IconRail />
      </nav>

      {/* Full chat list */}
      <aside className="w-96 border-r border-border bg-card">
        <Sidebar chats={chats} />
      </aside>

      {/* Message panel or placeholder */}
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}

export default function MessagesLayout({ children }: MessagesLayoutProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent>{children}</MessagesContent>
    </Suspense>
  );
}
