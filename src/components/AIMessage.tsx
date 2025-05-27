import type { Message } from "@/types/message";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import Image from "next/image";

interface AIMessageProps {
  message: Message;
}

export const AIMessage = ({ message }: AIMessageProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
        <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
          {message.content.map((content, i) => (
            <div key={i} className="prose dark:prose-invert max-w-none">
              {content.type === "text" && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {content.text}
                </ReactMarkdown>
              )}
              {content.type === "image_url" && content.imageUrl && (
                <Image
                  src={content.imageUrl}
                  alt="AI content"
                  className="max-w-full rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
