"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Heading,
  Quote,
  Code,
  ImageIcon,
  MoreHorizontal,
  X,
  Users,
  Flag,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Component() {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handlePreview = () => {
    if (!coverImage) {
      toast.error("Cover Image Required", {
        description: "Please add a cover image to preview your post.",
      });
      return;
    }
    if (!title) {
      toast.error("Title Required", {
        description: "Please add a title to your post.",
      });
      return;
    }
    if (!content) {
      toast.error("Content Required", {
        description: "Please add some content to your post.",
      });
      return;
    }
    toast.success("Loading Preview", {
      description: "Preparing to show your post preview.",
    });
    setIsPreview(!isPreview);
  };

  const handleExit = () => {
    if (coverImage || title || content) {
      setShowExitDialog(true);
    } else {
      router.back();
    }
  };

  const handleSaveDraft = () => {
    toast.success("Draft Saved", {
      description: "Your post has been saved as a draft.",
    });
    router.back();
  };

  if (isPreview) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b bg-card text-card-foreground">
          <h1 className="text-lg font-semibold">Preview Post</h1>
          <Button variant="ghost" size="sm" onClick={() => setIsPreview(false)}>
            Back to Edit
          </Button>
        </header>

        <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
          {coverImage && (
            <div className="w-full h-[400px] bg-muted rounded-lg mb-8 relative overflow-hidden">
              <Image
                src={coverImage}
                alt="Cover"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
              />
            </div>
          )}
          <h1 className="text-5xl font-bold mb-6">{title}</h1>
          <div className="prose prose-xl max-w-none dark:prose-invert">
            {content}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card text-card-foreground">
        <h1 className="text-lg font-semibold">Create Post</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handlePreview}>
            Preview
          </Button>
          <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleExit}
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to leave?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes. Leaving now will result in losing
                  your progress forever.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <AlertDialogAction
                  onClick={() => router.back()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Leave
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex flex-1">
        <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
          <div className="space-y-8">
            <Button
              variant="outline"
              className="w-fit bg-transparent text-lg"
              onClick={() => {
                // Handle cover image upload
                const imageUrl = "https://example.com/image.jpg"; // Replace with actual upload
                setCoverImage(imageUrl);
              }}
            >
              Add a cover image
            </Button>

            <Input
              className="text-4xl md:text-6xl lg:text-5xl font-extrabold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto py-2 md:py-3 lg:py-4"
              placeholder="New post title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              className="text-muted-foreground text-xl md:text-2xl lg:text-2xl border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto py-1 md:py-1.5 lg:py-2"
              placeholder="Add up to 4 tags..."
            />

            <div className="flex items-center gap-2 border-b pb-4">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Bold className="w-4 h-4" />
                <span className="sr-only">Bold</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Italic className="w-4 h-4" />
                <span className="sr-only">Italic</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Link className="w-4 h-4" />
                <span className="sr-only">Link</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <List className="w-4 h-4" />
                <span className="sr-only">Unordered List</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <ListOrdered className="w-4 h-4" />
                <span className="sr-only">Ordered List</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Heading className="w-4 h-4" />
                <span className="sr-only">Heading</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Quote className="w-4 h-4" />
                <span className="sr-only">Quote</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Code className="w-4 h-4" />
                <span className="sr-only">Code</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <ImageIcon className="w-4 h-4" />
                <span className="sr-only">Image</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 ml-auto"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <Button
                    variant="ghost"
                    className="w-full h-8 flex items-center justify-start gap-2 text-sm"
                    onClick={() => setContent("")}
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear content
                  </Button>
                </PopoverContent>
              </Popover>
            </div>

            <Textarea
              className="min-h-[400px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 resize-none text-base md:text-lg lg:text-xl"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-start p-4 border-t bg-card text-card-foreground gap-4">
        <Button>Publish</Button>
        <Button variant="ghost">Save draft</Button>

        {/* Dialog for Setting Milestones */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Set Milestones
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Project Milestones</DialogTitle>
              <DialogDescription>
                Define key milestones for your research project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <Input
                  className="text-base md:text-lg lg:text-xl"
                  placeholder="Milestone title..."
                />
                <Textarea
                  className="text-base md:text-lg lg:text-xl"
                  placeholder="Milestone description..."
                />
                <Input type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Milestones</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for Add Collaborators */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Add Collaborators
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Collaborators</DialogTitle>
              <DialogDescription>
                Search for students or researchers to collaborate on this post.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="collaborator-search"
                  placeholder="Search by name or email..."
                  className="col-span-4 text-base md:text-lg lg:text-xl"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected Collaborators:</h3>
                <ul className="text-muted-foreground text-sm">
                  <li>- John Doe (john.doe@example.com)</li>
                  <li>- Jane Smith (jane.smith@example.com)</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Selected</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
}
