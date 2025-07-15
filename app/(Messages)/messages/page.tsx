"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/components/useUserStore";

const socket = io("http://localhost:4000");

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const chatUser = searchParams.get("user");
  const { user: currentUser } = useUserStore();
  const [messages, setMessages] = useState<{ from: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser?.username) {
      socket.emit("identify", currentUser.username);
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !chatUser || !currentUser?.username) return;
    const msg = { to: chatUser, from: currentUser.username, content: input };
    setMessages((prev) => [
      ...prev,
      { from: currentUser.username || "", content: input },
    ]);
    socket.emit("message", msg);
    setInput("");
  };

  if (!chatUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a user to chat with.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background border-l border-muted">
      <div className="p-4 border-b border-muted font-semibold text-lg">
        Chat with @{chatUser}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm break-words ${
                msg.from === currentUser?.username
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-secondary text-secondary-foreground"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex gap-2 p-4 border-t border-muted"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
