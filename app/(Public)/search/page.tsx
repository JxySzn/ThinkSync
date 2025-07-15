"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface User {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  bio?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/users/search?q=${encodeURIComponent(initialQuery)}`
          );
          const data = await response.json();
          if (data.users) {
            setUsers(data.users);
          }
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [initialQuery]);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Search Results"}
      </h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="text-center text-muted-foreground">
            Coming soon...
          </div>
        </TabsContent>

        <TabsContent value="users">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : users.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <a
                  key={user._id}
                  href={`/profile/${user.username}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        {user.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="object-cover"
                          />
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.fullname}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                        {user.bio && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No users found for &ldquo;{searchQuery}&ldquo;
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts">
          <div className="text-center text-muted-foreground">
            Coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6 px-4">
          Loading search page...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
