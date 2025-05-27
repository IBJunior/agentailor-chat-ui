import { useState } from "react";
import { MessageInput } from "./MessageInput";
import MessageList from "./MessageList";
import type { Message, MessageDto } from "@/types/message";

export const Thread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState("default");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (messageText: string) => {
    setIsLoading(true);
    try {
      // Add user message to the chat
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'human',
        content: [{ type: 'text', text: messageText }]
      };
      setMessages(prev => [...prev, userMessage]);

      const messageDto: MessageDto = {
        threadId,
        type: 'human',
        content: [
          {
            type: 'text',
            text: messageText
          }
        ]
      };

      const response = await fetch('http://localhost:3001/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageDto),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add AI response to the chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: data.type,
        content: Array.isArray(data.content) ? data.content : [{ type: 'text', text: String(data.content) }]
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="py-4">
            <MessageList messages={messages} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Start a conversation by typing a message</p>
          </div>
        )}
      </div>

      <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-800 bg-background/50 backdrop-blur-sm">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
