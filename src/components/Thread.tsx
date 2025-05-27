import { MessageInput } from "./MessageInput";
import MessageList from "./MessageList";
import { useThread } from "@/contexts/ThreadContext";
import { Loader2 } from "lucide-react";

export const Thread = () => {
  const { messages, isLoading, isLoadingHistory, sendMessage } = useThread();

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-500">Loading conversation history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="py-4">
            <MessageList messages={messages} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Start a conversation by typing a message</p>
          </div>
        )}
      </div>

      <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-800 bg-background/50 backdrop-blur-sm">
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
