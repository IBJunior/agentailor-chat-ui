import type { Message } from "@/types/message";
import { UserIcon } from "lucide-react";
import Image from "next/image";

interface HumanMessageProps {
  message: Message;
}

export const HumanMessage = ({ message }: HumanMessageProps) => {
  return (
    <div className="flex gap-3 justify-end">
      <div className="max-w-[80%]">
        <div className="bg-blue-500 text-white rounded-2xl px-4 py-2">
          {message.content.map((content, i) => (
            <div key={i}>
              {content.type === "text" && <p>{content.text}</p>}
              {content.type === "image_url" && content.imageUrl && (
                <Image
                  src={content.imageUrl}
                  alt="User content"
                  className="max-w-full rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
        <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );
};
