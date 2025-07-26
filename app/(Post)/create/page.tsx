"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  X,
  Users,
  Flag,
  Trash2,
  Layout,
  LayoutGrid,
  Eye,
  Heart,
  Share2,
  MessageSquare,
} from "lucide-react";
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
import { Pencil } from "lucide-react";
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
  const [isPostCard, setIsPostCard] = useState(false);
  const [engagementGoals, setEngagementGoals] = useState({
    likes: [] as number[],
    comments: [] as number[],
    views: [] as number[],
    shares: [] as number[],
  });
  const [goalInputs, setGoalInputs] = useState({
    likes: "",
    comments: "",
    views: "",
    shares: "",
  });
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
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">
              {isPostCard ? "Post Card Preview" : "Full Post Preview"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsPostCard(!isPostCard);
                toast.success(
                  `Switched to ${
                    isPostCard ? "Full Post" : "Post Card"
                  } Preview`,
                  {
                    style: { background: "#22c55e", color: "white" },
                  }
                );
              }}
              className="flex items-center gap-2"
            >
              {isPostCard ? (
                <Layout className="w-4 h-4" />
              ) : (
                <LayoutGrid className="w-4 h-4" />
              )}
              View as {isPostCard ? "Full Post" : "Post Card"}
            </Button>
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
          {!isPostCard && coverImage && (
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
          {isPostCard ? (
            <div className="border rounded-lg overflow-hidden bg-card">
              <div className="aspect-[16/9] relative">
                <Image
                  src={coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <div className="flex gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="line-clamp-3 text-muted-foreground">
                  {editor?.getText() || ""}
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-5xl font-bold mb-4">{title}</h1>
              <div className="flex gap-2 mb-4">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-lg py-1 px-3"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              {(engagementGoals.likes.length > 0 ||
                engagementGoals.comments.length > 0 ||
                engagementGoals.views.length > 0 ||
                engagementGoals.shares.length > 0) && (
                <div className="flex flex-col gap-3 mb-6 text-muted-foreground border rounded-lg p-4 bg-muted/10">
                  <h3 className="text-lg font-semibold mb-2">
                    Engagement Milestones
                  </h3>
                  {engagementGoals.likes.map((goal, index) => (
                    <div key={`likes-${index}`} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span className="text-sm">Likes</span>
                        <span className="font-medium text-sm">
                          • Goal: {goal}
                        </span>
                      </div>
                      <Progress value={33} className="h-2 w-full bg-muted" />
                    </div>
                  ))}
                  {engagementGoals.comments.map((goal, index) => (
                    <div key={`comments-${index}`} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Comments</span>
                        <span className="font-medium text-sm">
                          • Goal: {goal}
                        </span>
                      </div>
                      <Progress value={33} className="h-2 w-full bg-muted" />
                    </div>
                  ))}
                  {engagementGoals.views.map((goal, index) => (
                    <div key={`views-${index}`} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Views</span>
                        <span className="font-medium text-sm">
                          • Goal: {goal}
                        </span>
                      </div>
                      <Progress value={33} className="h-2 w-full bg-muted" />
                    </div>
                  ))}
                  {engagementGoals.shares.map((goal, index) => (
                    <div key={`shares-${index}`} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Shares</span>
                        <span className="font-medium text-sm">
                          • Goal: {goal}
                        </span>
                      </div>
                      <Progress value={33} className="h-2 w-full bg-muted" />
                    </div>
                  ))}
                </div>
              )}
              <div
                className="prose prose-xl max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
              ></div>
            </>
          )}
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
                    const loadingToast = toast.loading(
                      "Uploading cover image..."
                    );
                    try {
                      const imageUrl = await uploadToCloudinary(
                        file,
                        "blog_covers"
                      );
                      setCoverImage(imageUrl);
                      toast.dismiss(loadingToast);
                      toast.success("Cover image uploaded!", {
                        style: { background: "#22c55e", color: "white" },
                      });
                    } catch (error) {
                      toast.dismiss(loadingToast);
                      toast.error("Failed to upload image", {
                        description:
                          "Please check your internet connection and try again.",
                        style: { background: "#ef4444", color: "white" },
                        duration: 5000,
                      });
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
                    placeholder="Add searchable tags (e.g. research, science, tech)..."
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

            {/* Engagement Goals Display in Edit Mode */}
            {(engagementGoals.likes.length > 0 ||
              engagementGoals.comments.length > 0 ||
              engagementGoals.views.length > 0 ||
              engagementGoals.shares.length > 0) && (
              <div className="flex flex-col gap-3 mb-6 text-muted-foreground border rounded-lg p-4 bg-muted/10">
                <h3 className="text-lg font-semibold mb-2">
                  Engagement Milestones
                </h3>
                {engagementGoals.likes.map((goal, index) => (
                  <div
                    key={`likes-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Likes Goal: {goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Likes Goal</DialogTitle>
                          </DialogHeader>
                          <Input
                            type="number"
                            defaultValue={goal}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              if (newValue > 0) {
                                const newLikes = [...engagementGoals.likes];
                                newLikes[index] = newValue;
                                setEngagementGoals((prev) => ({
                                  ...prev,
                                  likes: newLikes,
                                }));
                              }
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          setEngagementGoals((prev) => ({
                            ...prev,
                            likes: prev.likes.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {engagementGoals.comments.map((goal, index) => (
                  <div
                    key={`comments-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span>Comments Goal: {goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Comments Goal</DialogTitle>
                          </DialogHeader>
                          <Input
                            type="number"
                            defaultValue={goal}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              if (newValue > 0) {
                                const newComments = [
                                  ...engagementGoals.comments,
                                ];
                                newComments[index] = newValue;
                                setEngagementGoals((prev) => ({
                                  ...prev,
                                  comments: newComments,
                                }));
                              }
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          setEngagementGoals((prev) => ({
                            ...prev,
                            comments: prev.comments.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {engagementGoals.views.map((goal, index) => (
                  <div
                    key={`views-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span>Views Goal: {goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Views Goal</DialogTitle>
                          </DialogHeader>
                          <Input
                            type="number"
                            defaultValue={goal}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              if (newValue > 0) {
                                const newViews = [...engagementGoals.views];
                                newViews[index] = newValue;
                                setEngagementGoals((prev) => ({
                                  ...prev,
                                  views: newViews,
                                }));
                              }
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          setEngagementGoals((prev) => ({
                            ...prev,
                            views: prev.views.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {engagementGoals.shares.map((goal, index) => (
                  <div
                    key={`shares-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-purple-500" />
                      <span>Shares Goal: {goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Shares Goal</DialogTitle>
                          </DialogHeader>
                          <Input
                            type="number"
                            defaultValue={goal}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              if (newValue > 0) {
                                const newShares = [...engagementGoals.shares];
                                newShares[index] = newValue;
                                setEngagementGoals((prev) => ({
                                  ...prev,
                                  shares: newShares,
                                }));
                              }
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          setEngagementGoals((prev) => ({
                            ...prev,
                            shares: prev.shares.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                          const loadingToast =
                            toast.loading("Uploading image...");
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
                            toast.dismiss(loadingToast);
                            toast.success("Image uploaded!", {
                              style: { background: "#22c55e", color: "white" },
                            });
                          } catch (error) {
                            toast.dismiss(loadingToast);
                            toast.error("Failed to upload image", {
                              description:
                                "Please check your internet connection and try again.",
                              style: { background: "#ef4444", color: "white" },
                              duration: 5000,
                            });
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 ml-auto hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Clear content</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Content?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove all content from your post. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          editor?.commands.clearContent();
                          toast.success("Content cleared", {
                            style: { background: "#22c55e", color: "white" },
                          });
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Clear Content
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TooltipProvider>

            <div className="border-2 rounded-lg p-4 overflow-hidden">
              <EditorContent
                editor={editor}
                className="prose-lg max-w-none [&_img]:max-w-full [&_img]:!my-4 [&_p]:break-words [&_pre]:overflow-auto"
              />
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
              Set Engagement Goals
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Set Post Engagement Goals</DialogTitle>
              <DialogDescription>
                Set multiple engagement targets for your post.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <label className="text-sm font-medium">Target Likes</label>
                  </div>
                  <Input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    min="0"
                    className="text-lg"
                    placeholder="100"
                    value={goalInputs.likes}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setGoalInputs((prev) => ({
                        ...prev,
                        likes: value,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <label className="text-sm font-medium">
                      Target Comments
                    </label>
                  </div>
                  <Input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    min="0"
                    className="text-lg"
                    placeholder="50"
                    value={goalInputs.comments}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setGoalInputs((prev) => ({
                        ...prev,
                        comments: value,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-500" />
                    <label className="text-sm font-medium">Target Views</label>
                  </div>
                  <Input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    min="0"
                    className="text-lg"
                    placeholder="1000"
                    value={goalInputs.views}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setGoalInputs((prev) => ({
                        ...prev,
                        views: value,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-purple-500" />
                    <label className="text-sm font-medium">Target Shares</label>
                  </div>
                  <Input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    min="0"
                    className="text-lg"
                    placeholder="25"
                    value={goalInputs.shares}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setGoalInputs((prev) => ({
                        ...prev,
                        shares: value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={(e) => {
                  const closeDialog = (e.target as HTMLElement).closest(
                    "dialog"
                  );
                  const newGoals = {
                    likes: goalInputs.likes
                      ? [...engagementGoals.likes, parseInt(goalInputs.likes)]
                      : engagementGoals.likes,
                    comments: goalInputs.comments
                      ? [
                          ...engagementGoals.comments,
                          parseInt(goalInputs.comments),
                        ]
                      : engagementGoals.comments,
                    views: goalInputs.views
                      ? [...engagementGoals.views, parseInt(goalInputs.views)]
                      : engagementGoals.views,
                    shares: goalInputs.shares
                      ? [...engagementGoals.shares, parseInt(goalInputs.shares)]
                      : engagementGoals.shares,
                  };
                  setEngagementGoals(newGoals);
                  setGoalInputs({
                    likes: "",
                    comments: "",
                    views: "",
                    shares: "",
                  });
                  toast.success("Engagement goals updated!", {
                    style: { background: "#22c55e", color: "white" },
                  });
                  if (closeDialog) {
                    closeDialog.close();
                  }
                }}
                className="w-full"
              >
                Set Goals
              </Button>
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
