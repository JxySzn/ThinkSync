"use client";

import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";

interface MessageSidebarProps {
  chats: Array<{
    id: string;
    name: string;
    last: string;
    avatar?: string;
    username?: string;
  }>;
}

export default function MessageSidebar({ chats }: MessageSidebarProps) {
  const [search, setSearch] = useState("");

  return (
    <div className="w-80 border-r h-screen">
      <div className="p-4">
        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-y-auto">
        {chats.length === 0 ? (
          <Card className="m-2 p-4">
            <p className="text-muted-foreground text-sm">No messages yet</p>
          </Card>
        ) : (
          chats.map((chat) => (
            <Card key={chat.id} className="m-2 p-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium">{chat.name}</p>
                  <p className="text-sm text-muted-foreground">{chat.last}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
