import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { _id: string; fullname?: string; username: string; name?: string }[]
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<string | number>("100%");

  // Set popover width to match input
  useEffect(() => {
    if (containerRef.current) {
      setPopoverWidth(containerRef.current.offsetWidth);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowPopover(false);
      return;
    }
    setSearchLoading(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/users?query=${encodeURIComponent(searchQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          // Filter by username, fullname, or any name containing the query (case-insensitive)
          const filtered = (data.users || []).filter(
            (user: {
              _id: string;
              fullname?: string;
              username: string;
              name?: string;
            }) => {
              const q = searchQuery.toLowerCase();
              return (
                user.username?.toLowerCase().includes(q) ||
                user.fullname?.toLowerCase().includes(q) ||
                user.name?.toLowerCase().includes(q)
              );
            }
          );
          setSearchResults(filtered);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      }
      setSearchLoading(false);
      setShowPopover(true);
    }, 350); // debounce ms
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  // Keep focus on input after selecting a result
  const handleResultClick = () => {
    // You can add navigation or other logic here
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setShowPopover(true); // keep popover open
  };

  // Youtube-like style: rounded, shadow, border, flex row, search icon, input, search button
  return (
    <div
      ref={containerRef}
      className="w-full max-w-xl flex items-center rounded-full border bg-background shadow px-4 py-2 gap-2"
    >
      <Popover
        open={
          showPopover &&
          (searchResults.length > 0 || searchLoading || !!searchQuery)
        }
        onOpenChange={setShowPopover}
      >
        <PopoverTrigger asChild>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowPopover(true)}
              className="pl-10 pr-4 w-full bg-transparent border-none shadow-none focus:ring-0 focus:outline-none"
              autoComplete="off"
              style={{ borderRadius: 0, background: "transparent" }}
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          style={{
            width: popoverWidth,
            minWidth: 200,
            maxWidth: 600,
            padding: 0,
            marginTop: 8,
          }}
          className="rounded-xl shadow-lg border bg-background"
        >
          {searchLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-2 hover:bg-accent cursor-pointer flex flex-col"
                  onMouseDown={handleResultClick}
                >
                  <span className="font-medium">
                    {user.fullname || user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                </li>
              ))}
            </ul>
          ) : searchQuery ? (
            <div className="p-4 text-center text-muted-foreground">
              No users found.
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
      <button
        className="ml-2 rounded-full bg-primary text-primary-foreground px-4 py-2 font-semibold hover:bg-primary/90 transition-colors"
        onClick={() => {
          if (inputRef.current) inputRef.current.focus();
          setShowPopover(true);
        }}
        type="button"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SearchBar;
