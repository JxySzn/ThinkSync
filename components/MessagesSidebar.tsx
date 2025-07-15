"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "./useSession";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  verified: boolean;
}

export function MessagesSidebar() {
  const { user: currentUser, loading: sessionLoading } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && currentUser) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.users || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [sessionLoading, currentUser]);

  return (
    <aside className="w-[470px] pl-10 h-screen overflow-y-auto border-r border-muted bg-background flex flex-col">
      <div className="p-4 text-lg font-semibold border-b border-muted">
        Chats
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : users.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No users found
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-muted">
          {users.map((user) => (
            <li
              key={user._id}
              className="px-2 py-2 cursor-pointer"
              onClick={() => setSelectedUserId(user._id)}
            >
              <Card
                className={`flex items-center gap-3 p-3 transition-colors ${
                  selectedUserId === user._id ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-primary-foreground overflow-hidden">
                  {user.fullname.charAt(0).toUpperCase()}
                </div>
                {/* User Info and Preview */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium text-foreground truncate">
                    {user.fullname}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    @{user.username || user.email}
                  </span>
                  <span className="text-xs text-muted-foreground truncate mt-1">
                    Last message preview...
                  </span>
                </div>
                {/* Time and Unread Badge */}
                <div className="flex flex-col items-end gap-1 min-w-[48px]">
                  <span className="text-xs text-muted-foreground">03:58</span>
                  <Badge className="rounded-full px-2 py-0.5 bg-primary text-primary-foreground">
                    1
                  </Badge>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
