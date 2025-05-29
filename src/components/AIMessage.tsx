import type { Message } from "@/types/message";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AIMessageProps {
  message: Message;
}

export const AIMessage = ({ message }: AIMessageProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="h-5 w-5 text-primary" />
      </div>
      <div className="max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            "bg-gray-200/30 text-gray-800",
            "backdrop-blur-sm supports-[backdrop-filter]:bg-gray-200/30"
          )}
        >
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
                  alt="AI generated content"
                  width={400}
                  height={300}
                  className="max-w-full rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
