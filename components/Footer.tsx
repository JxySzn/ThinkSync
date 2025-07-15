"use client";

import Link from "next/link";
import { BookOpen, Twitter, Github, Linkedin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "GitHub", href: "#", icon: Github },
  { name: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2 md:justify-start md:w-auto w-full mb-6 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ThinkSync</span>
            </Link>
          </div>
          <div className="flex flex-col items-end md:items-end md:w-auto w-full">
            <p className="text-sm text-muted-foreground text-right">
              Empowering researchers worldwide to collaborate, discover, and
              innovate together.
            </p>
            <div className="mt-6 flex space-x-4 justify-end">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 w-full flex justify-center">
          <div className="w-full" style={{ maxWidth: "1200px" }}>
            <div className="border-t border-muted w-full" />
          </div>
        </div>
        <div
          className="pt-8 w-full flex justify-between items-center"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <p className="text-sm text-muted-foreground text-left">
            &copy; {new Date().getFullYear()} ResearchHub. All rights reserved.
          </p>
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
