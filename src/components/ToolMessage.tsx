import React, { useState } from "react";
import type { Message } from "@/types/message";
import { LucidePenTool, Settings2Icon } from "lucide-react";

interface ToolMessageProps {
  message: Message;
}

const formatContent = (content: any) => {
  if (typeof content === "string") {
    try {
      const json = JSON.parse(content);
      return (
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(json, null, 2)}
        </pre>
      );
    } catch {
      return <div className="text-sm">{content}</div>;
    }
  } else if (Array.isArray(content)) {
    return (
      <div className="space-y-2">
        {content.map((item, idx) => (
          <div key={idx}>{formatContent(item)}</div>
        ))}
      </div>
    );
  } else if (typeof content === "object" && content !== null) {
    return (
      <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
        {JSON.stringify(content, null, 2)}
      </pre>
    );
  }
  return <div className="text-sm">{String(content)}</div>;
};

export const ToolMessage = ({ message }: ToolMessageProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded p-4 bg-gray-50">
      <button
        className="font-semibold text-primary hover:underline focus:outline-none cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <Settings2Icon className="inline mr-1 h-4 w-4" />
        Tool call
      </button>
      {open && <div className="mt-2">{formatContent(message.content)}</div>}
    </div>
  );
};
