import { Book, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="pl-64 min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-lg flex-1 flex flex-col justify-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center mb-2">
          <Book className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-foreground text-2xl font-medium">
            ThinkSync for Desktop
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            Sync your thoughts and ideas seamlessly across all your devices.
            Access your knowledge base from anywhere, anytime.
          </p>
        </div>

        {/* Action Button */}
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
          size="lg"
        >
          Get Started
        </Button>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm pb-8">
        <Lock className="w-4 h-4" />
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
}
