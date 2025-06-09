import type { Message } from "@/types/message";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HumanMessageProps {
  message: Message;
}

export const HumanMessage = ({ message }: HumanMessageProps) => {
  return (
    <div className="flex gap-3 justify-end">
      <div className="max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            "bg-gray-300/50 text-gray-800",
            "backdrop-blur-sm supports-[backdrop-filter]:bg-gray-300/50"
          )}
        >
          {message.content.map((content, i) => (
            <div key={i} className="prose dark:prose-invert max-w-none">
              {content.type === "text" && <p className="my-0">{content.text}</p>}
              {content.type === "image_url" && content.imageUrl && (
                <Image
                  src={content.imageUrl}
                  alt="User content"
                  width={400}
                  height={300}
                  className="max-w-full rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <UserIcon className="h-5 w-5 text-primary" />
      </div>
    </div>
  );
};
