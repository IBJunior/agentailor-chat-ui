import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const MessageInput = ({ onSendMessage, isLoading = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    await onSendMessage(message);
    setMessage("");
  };

  return (    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."        className={cn(
          "min-h-[80px] max-h-[240px] pr-16 resize-none rounded-xl",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border-zinc-200 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-700",
          "shadow-sm transition-all duration-200",
          "p-4 text-base"
        )}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isLoading}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "bg-primary hover:bg-primary/90 transition-all duration-200",
          "rounded-lg shadow-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (          <SendHorizontal className="h-5 w-5 text-white" />
        )}
      </Button>
    </form>
  );
};
