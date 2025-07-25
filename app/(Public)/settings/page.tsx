"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="container py-8 px-5">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full border-b">
          <TabsTrigger value="account" className="flex-1">
            Account
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex-1">
            Privacy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex-1">
            Appearance
          </TabsTrigger>
        </TabsList>
        <div className="py-6 w-full">
          <TabsContent value="account" className="w-full">
            <div className="w-full space-y-8">
              <section className="w-full max-w-6xl space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Profile Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Update your personal information and how others see you on
                    the platform.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Your username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself" />
                  </div>
                </div>
              </section>

              <section className="w-full  max-w-6x space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">Change Password</h2>
                  <p className="text-sm text-muted-foreground">
                    Ensure your account is secure by using a strong password.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      type="password"
                      id="current-password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      type="password"
                      id="new-password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      type="password"
                      id="confirm-password"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
              </section>

              <section className="w-full  max-w-6x space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-destructive">
                    Delete Account
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="delete-confirm"
                        className="text-destructive"
                      >
                        Type &quot;DELETE&quot; to confirm
                      </Label>
                      <Input
                        id="delete-confirm"
                        placeholder="DELETE"
                        className="border-destructive/50"
                      />
                    </div>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="w-full">
            <div className="w-full  max-w-5x space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Privacy Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Manage how your information is displayed and shared.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to everyone
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Message Privacy</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow messages from non-followers
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="w-full">
            <div className="w-full max-w-max-w-5x space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Notification Preferences
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose how and when you want to be notified.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about important updates and
                      activity
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant notifications in your browser
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Message Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="w-full">
            <div className="w-full max-w-5xl space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Appearance Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how ThinkSync looks on your device.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark mode
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-8 max-w-3xl flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
