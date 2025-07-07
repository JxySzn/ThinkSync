"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "./useSession";

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
    <aside className="w-96 pl-10 h-screen overflow-y-auto border-r border-muted bg-background flex flex-col">
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
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                selectedUserId === user._id ? "bg-muted" : "hover:bg-muted/60"
              }`}
              onClick={() => setSelectedUserId(user._id)}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-primary-foreground">
                {user.fullname.charAt(0).toUpperCase()}
              </div>
              {/* User Info */}
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-foreground truncate">
                  {user.fullname}
                </span>
                <span className="text-sm text-muted-foreground truncate">
                  @{user.username || user.email}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
