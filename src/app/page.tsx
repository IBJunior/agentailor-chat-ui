"use client";
import { Header } from "@/components/Header";
import { MessageInput } from "@/components/MessageInput";

export default function Home() {
  const handleSendMessage = (message: string) => {
    // TODO: Send message to the backend
    console.log("Sending message:", message);
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative w-full">
        <Header title="Agent Chat" />

        {/* Main Content Area with Centered Input */}
        <div className="min-h-screen pt-20 flex items-center justify-center p-4">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
