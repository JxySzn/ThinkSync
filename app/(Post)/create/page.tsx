"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({
        openOnClick: false,
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: "rounded-lg float-left mr-4 my-2",
          style: "max-width: 50%; max-height: 400px; object-fit: contain;",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your post content here...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] prose prose-lg dark:prose-invert focus:outline-none",
      },
    },
    onCreate({ editor }) {
      editor.commands.focus("end");
    },
    editable: true,
    injectCSS: true,
    enableCoreExtensions: true,
    immediatelyRender: false, // Fix for SSR hydration
  });

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
    if (!editor?.getHTML() || editor?.getHTML() === "<p></p>") {
      toast.error("Content Required", {
        description: "Please add some content to your post.",
      });
      return;
    }
    const newState = !isPreview;
    setIsPreview(newState);
    toast.success(newState ? "Switched to Preview" : "Switched to Edit", {
      style: { background: "#22c55e", color: "white" },
    });
  };

  const handleExit = () => {
    if (
      coverImage ||
      title ||
      (editor?.getHTML() && editor?.getHTML() !== "<p></p>")
    ) {
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsPreview(false);
                toast.success("Switched to Edit", {
                  style: { background: "#22c55e", color: "white" },
                });
              }}
            >
              Back to Edit
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
          <div
            className="prose prose-xl max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
          ></div>
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

      <main className="flex-1">
        <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
          <div className="space-y-8">
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const imageUrl = await uploadToCloudinary(
                        file,
                        "blog_covers"
                      );
                      setCoverImage(imageUrl);
                      toast.success("Cover image uploaded!", {
                        style: { background: "#22c55e", color: "white" },
                      });
                    } catch (error) {
                      toast.error("Failed to upload image");
                      console.error("Upload error:", error);
                    }
                  }
                }}
              />
              {coverImage ? (
                <div className="relative">
                  <div className="w-full h-[300px] bg-muted rounded-lg relative overflow-hidden">
                    <Image
                      src={coverImage}
                      alt="Cover"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setCoverImage("");
                      toast.success("Cover image removed", {
                        style: { background: "#22c55e", color: "white" },
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-fit bg-transparent text-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add a cover image
                </Button>
              )}
            </div>

            <Input
              className="text-4xl md:text-6xl lg:text-5xl font-extrabold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto py-2 md:py-3 lg:py-4"
              placeholder="New post title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    className="text-muted-foreground text-xl md:text-2xl lg:text-2xl border-2 focus-visible:ring-0 focus-visible:ring-offset-0 p-2 h-auto"
                    placeholder="Add up to 4 tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (tagInput && tags.length < 4) {
                          setTags([...tags, tagInput.replace(/^#/, "")]);
                          setTagInput("");
                          toast.success("Tag added", {
                            style: { background: "#22c55e", color: "white" },
                          });
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (tagInput && tags.length < 4) {
                        setTags([...tags, tagInput.replace(/^#/, "")]);
                        setTagInput("");
                        toast.success("Tag added", {
                          style: { background: "#22c55e", color: "white" },
                        });
                      }
                    }}
                    className="h-12"
                  >
                    Add Tag
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="text-lg py-1 px-3"
                      onClick={() => {
                        setTags(tags.filter((_, i) => i !== index));
                        toast.success("Tag removed", {
                          style: { background: "#22c55e", color: "white" },
                        });
                      }}
                    >
                      #{tag}
                      <X className="w-4 h-4 ml-2 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <TooltipProvider>
              <div className="flex items-center gap-2 border-b pb-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      data-active={editor?.isActive("bold")}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      data-active={editor?.isActive("italic")}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 1 })
                          .run()
                      }
                      data-active={editor?.isActive("heading", { level: 1 })}
                    >
                      <div className="text-lg font-bold">H1</div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Large Heading</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run()
                      }
                      data-active={editor?.isActive("heading", { level: 2 })}
                    >
                      <div className="text-base font-bold">H2</div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Medium Heading</TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="h-6" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                      }
                      data-active={editor?.isActive("bulletList")}
                    >
                      <List className="w-4 h-4" />
                      <span className="sr-only">Bullet List</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                      }
                      data-active={editor?.isActive("orderedList")}
                    >
                      <ListOrdered className="w-4 h-4" />
                      <span className="sr-only">Numbered List</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                      }
                      data-active={editor?.isActive("blockquote")}
                    >
                      <Quote className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Block Quote</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        editor?.chain().focus().toggleCodeBlock().run()
                      }
                      data-active={editor?.isActive("codeBlock")}
                    >
                      <Code className="w-4 h-4" />
                      <span className="sr-only">Code</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Code Block</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      id="image-upload"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const imageUrl = await uploadToCloudinary(
                              file,
                              "blog_content"
                            );
                            editor
                              ?.chain()
                              .focus()
                              .setImage({ src: imageUrl })
                              .run();
                            toast.success("Image uploaded!", {
                              style: { background: "#22c55e", color: "white" },
                            });
                          } catch (error) {
                            toast.error("Failed to upload image");
                            console.error("Upload error:", error);
                          }
                        }
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Insert File</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="sr-only">Image</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Image</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 ml-auto"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>More Options</TooltipContent>
                </Tooltip>

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
                      onClick={() => {
                        editor?.commands.clearContent();
                        toast.success("Content cleared", {
                          style: { background: "#22c55e", color: "white" },
                        });
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear content
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </TooltipProvider>

            <div className="border-2 rounded-lg p-4">
              <EditorContent editor={editor} className="prose-lg" />
            </div>
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
