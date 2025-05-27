import { Message } from "@/types/message";
import { UserIcon, Bot } from "lucide-react";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.type === "human" ? "justify-end" : "justify-start"
          }`}
        >
          {message.type !== "human" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          )}
          
          <div
            className={`rounded-2xl px-4 py-2 max-w-[80%] ${
              message.type === "human"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {message.content.map((content, index) => (
              <div key={index}>
                {content.type === "text" && <p>{content.text}</p>}
                {content.type === "image_url" && content.imageUrl && (
                  <img
                    src={content.imageUrl}
                    alt="Message content"
                    className="max-w-full rounded"
                  />
                )}
              </div>
            ))}
          </div>

          {message.type === "human" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
