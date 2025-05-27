import type { Message } from "@/types/message";
import { HumanMessage } from "./HumanMessage";
import { AIMessage } from "./AIMessage";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-4">
      {messages.map((message, index) =>
        message.type === "human" ? (
          <HumanMessage key={index} message={message} />
        ) : (
          <AIMessage key={index} message={message} />
        )
      )}
    </div>
  );
};

export default MessageList;
