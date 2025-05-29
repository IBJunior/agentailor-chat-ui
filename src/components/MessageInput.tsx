import { useState } from "react";
import { Loader2, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const MessageInput = ({ onSendMessage, isLoading = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    await onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[200px] pr-16 resize-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
            className="absolute right-2 top-1/2 -translate-y-1/2"
            variant="default"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
