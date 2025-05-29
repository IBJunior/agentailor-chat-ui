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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {messages.map((message, index) =>
        message.type === "human" ? (
          <HumanMessage key={index} message={message} />
        ) : (
          <AIMessage key={index} message={message} />
        )
      )}
      <div ref={bottomRef} className="h-px" />
    </div>
  );
};

export default MessageList;
