import { useState } from "react";
import { SendIcon } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className={`w-full max-w-3xl p-4 transition-all duration-300 ease-in-out ${
      isFocused ? 'scale-105' : 'scale-100'
    }`}>
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1 group">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            className="w-full resize-none rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 focus:outline-none focus:ring-0 min-h-[60px] max-h-[200px] pr-16 transition-all duration-200 ease-in-out placeholder:text-gray-400 dark:placeholder:text-gray-500 border"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
