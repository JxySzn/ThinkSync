"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Users,
  GitBranch,
  Quote,
  FileText,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SessionRedirect } from "@/components/SessionRedirect";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import About from "@/components/About";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Users,
    title: "Group Formation",
    description:
      "Connect with researchers who share your interests and expertise. Share ideas, form study groups, and collaborate on projects seamlessly.",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      "Share and discover research materials, datasets, and references in a centralized, searchable repository.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description:
      "Never lose your work with comprehensive version history,to never loose track of your progress.",
  },
];

const testimonials = [
  {
    name: "Levi Okoye",
    role: "Graduate Student, NIIT",
    avatar: "/testimonial1.jpeg",
    content:
      "ThinkSync made it easy to find collaborators for my thesis. The group formation and milestone tracking features kept our research on track and organized.",
  },
  {
    name: "Arun Maini",
    role: "Research Supervisor, University of Lagos",
    avatar: "/testimonial2.jpg",
    content:
      "As a supervisor, I love the version control and collaborative writing tools. I can review drafts, leave comments, and help my students improve their work in real time.",
  },
  {
    name: "Fisayo Fosudo",
    role: "Data Scientist, Research Community Member",
    avatar: "/testimonial3.jpeg",
    content:
      "The resource library and citation management tools are invaluable. Sharing datasets and keeping references organized has never been easier for our team.",
  },
];

export default function LandingPage() {
  useEffect(() => {
    function animateConstellations(canvasId: string) {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      resize();

      const STAR_COUNT = 60;
      const stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
      }));

      function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        for (const star of stars) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const a = stars[i],
              b = stars[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      function update() {
        for (const star of stars) {
          star.x += star.dx;
          star.y += star.dy;
          if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
          if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
        }
      }

      function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
      }
      loop();

      window.addEventListener("resize", resize);
    }

    animateConstellations("constellation-canvas");
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center overflow-x-hidden">
      <SessionRedirect />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 md:py-32 w-full flex justify-center">
        {/* Constellation Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <canvas
            id="constellation-canvas"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 px-2 sm:px-4 md:px-6 lg:px-8 flex flex-col items-center w-full max-w-full">
          <motion.div
            className="mx-auto w-full max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              Collaborate. Research.{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Discover.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 sm:mt-6 max-w-full sm:max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground"
              variants={fadeInUp}
            >
              The digital workspace where students and researchers form groups,
              share resources, co-author papers, and track milestones with
              powerful version control and citation tools.
            </motion.p>

            <motion.div
              className="mt-8 sm:mt-10 flex items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <Button
                asChild
                size="lg"
                className="h-12 px-8 bg-primary hover:cursor-pointer text-foreground"
              >
                <Link href="/sign_in">Get Started</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 sm:py-32 w-full flex justify-center"
      >
        <div className="container px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for research collaboration
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed specifically for the academic research
              workflow
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 bg-muted/50 transition-colors hover:bg-muted/80">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <About id="about" />

      {/* FAQ Section */}
      <FAQ id="faq" />

      {/* Testimonials Section */}
      <section
        id="Testimonials"
        className="py-20 sm:py-32 w-full flex justify-center"
      >
        <div className="container px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted By The Tech community Best Minds
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our community has to say about their research experience
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <blockquote className="text-lg">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <ContactForm id="contact" />
    </div>
  );
}
