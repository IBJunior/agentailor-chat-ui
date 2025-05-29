import { MessageInput } from "./MessageInput";
import MessageList from "./MessageList";
import { useThread } from "@/contexts/ThreadContext";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

export const Thread = () => {
  const { messages, isLoading, isLoadingHistory, sendMessage } = useThread();

  if (isLoadingHistory) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading conversation history...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {messages.length > 0 ? (
        <>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="px-4 py-4 space-y-4">
                <MessageList messages={messages} />
              </div>
            </ScrollArea>
          </div>
          <div className="flex-shrink-0">
            <div className="p-4 w-full pb-6">
              <div className="mx-auto max-w-3xl">
                <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl px-4">
            <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
};
