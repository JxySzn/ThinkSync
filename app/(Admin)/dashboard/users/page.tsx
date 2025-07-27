"use client";

import { useState, useEffect } from "react";
import { useAdminProtected } from "@/hooks/useAdminProtected";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Filter,
  Settings,
  MoreHorizontal,
  Info,
  Shield,
  Crown,
} from "lucide-react";

interface User {
  _id: string;
  fullname: string;
  email: string;
  verified: boolean;
  username: string;
  joinDate: string;
  online: boolean;
  role: "admin" | "user";
  status: "active" | "suspended";
}

export default function UserList() {
  const { isAdmin, isLoading } = useAdminProtected();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    onlineUsers: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        setUsers(data.users);

        // Calculate stats
        setStats({
          totalUsers: data.users.length,
          activeUsers: data.users.filter((u: User) => u.status === "active")
            .length,
          suspendedUsers: data.users.filter(
            (u: User) => u.status === "suspended"
          ).length,
          onlineUsers: data.users.filter((u: User) => u.online).length,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      change: "All registered users",
      icon: Users,
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toString(),
      change: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(
        1
      )}% of total users`,
      icon: UserCheck,
    },
    {
      title: "Suspended Users",
      value: stats.suspendedUsers.toString(),
      change: `${((stats.suspendedUsers / stats.totalUsers) * 100).toFixed(
        1
      )}% of total users`,
      icon: UserX,
    },
    {
      title: "Online Users",
      value: stats.onlineUsers.toString(),
      change: `${((stats.onlineUsers / stats.totalUsers) * 100).toFixed(
        1
      )}% of total users`,
      icon: UserPlus,
    },
  ];

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Suspended":
        return "destructive";
      case "Invited":
        return "secondary";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The hook will handle redirection
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User List</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <stat.icon className="w-4 h-4" />
                {stat.title}
                <Info className="w-3 h-3 opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input placeholder="Filter tasks..." className="max-w-sm" />
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Status
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Role
        </Button>
        <Button variant="outline" size="sm" className="ml-auto bg-transparent">
          <Settings className="w-4 h-4 mr-2" />
          View
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Online Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onCheckedChange={(checked) =>
                      handleSelectUser(user._id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <span className="underline font-medium">{user.fullname}</span>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(user.joinDate), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>{user.online ? "Online" : "Offline"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.role === "admin" ? (
                      <Crown className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                    {user.role}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
