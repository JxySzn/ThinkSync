"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Menu,
  X,
  BookOpen,
  Search,
  Bell,
  Plus,
  LogOut,
  User,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "./useSession";
import SearchBar from "./SearchBar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Navbar2() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { user, loading, signOut } = useSession();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  // Generate avatar initials from user's name
  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-20 bg-background shadow">
        <nav className="flex h-16 items-center justify-between max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            {isSearchMode ? (
              // Search Mode View
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center w-full space-x-2"
                key="search-mode"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchMode(false)}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <SearchBar />
                </div>
              </motion.div>
            ) : (
              // Normal Mode View
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center w-full justify-between"
                key="normal-mode"
              >
                <div className="flex items-center pl-4 sm:pl-6 lg:pl-8">
                  <Link href="/home" className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <BookOpen className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">ThinkSync</span>
                  </Link>
                </div>

                {/* Search Bar for md and up */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                  <SearchBar />
                </div>

                <div className="flex items-center space-x-4 pr-4 sm:pr-6 lg:pr-8">
                  {/* Create Post Button */}
                  <Button
                    size="sm"
                    className="hidden md:flex"
                    onClick={() => {
                      if (!user && !loading) setShowDialog(true);
                      else router.push("/create");
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>

                  {/* Mobile Search Icon */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setIsSearchMode(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  {/* Notification Bell */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                  </Button>

                  {/* User Avatar Dropdown */}
                  {!loading && user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full"
                        >
                          <Avatar className="h-8 w-8 overflow-hidden">
                            <AvatarImage
                              src={
                                user.avatar ||
                                "/placeholder.svg?height=128&width=128"
                              }
                              alt={user.fullname}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                            <AvatarFallback>
                              {getAvatarInitials(user.fullname)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user.fullname}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profile">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Mobile menu button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Mobile Navigation - Slides in from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l shadow-xl z-40 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Mobile Actions */}
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="mr-3 h-4 w-4" />
                      Notifications
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        if (!user && !loading) setShowDialog(true);
                        else router.push("/create");
                      }}
                    >
                      <Plus className="mr-3 h-4 w-4" />
                      Create Post
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={signOut}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>

                {/* Footer with Theme Toggle */}
                <div className="p-4 border-t">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AlertDialog for auth required */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign up or log in required</DialogTitle>
          </DialogHeader>
          <p className="mb-4">You must be signed in to create a blog post.</p>
          <DialogFooter>
            <Button onClick={() => router.push("/sign_in")}>Sign In</Button>
            <Button variant="secondary" onClick={() => router.push("/sign_up")}>
              Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
