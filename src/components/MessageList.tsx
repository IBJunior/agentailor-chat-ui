import type { Message } from "@/types/message";
import { HumanMessage } from "./HumanMessage";
import { AIMessage } from "./AIMessage";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // Deduplicate messages by ID
  const uniqueMessages = messages.reduce((acc: Message[], message) => {
    const isDuplicate = acc.some(m => m.id === message.id);
    if (!isDuplicate) {
      acc.push(message);
    }
    return acc;
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {uniqueMessages.map((message) =>
        message.type === "human" ? (
          <HumanMessage key={message.id} message={message} />
        ) : (
          <AIMessage key={message.id} message={message} />
        )
      )}
      <div ref={bottomRef} className="h-px" />
    </div>
  );
};

export default MessageList;
