"use client";
import { MainLayout } from "@/components/MainLayout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessagesSquare } from "lucide-react";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const router = useRouter();
  const { createThread } = useChat();

  const handleStartNewThread = async () => {
    const newThread = await createThread();
    router.push(`/thread/${newThread.id}`);
  };

  return (
    <MainLayout>
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl px-4 text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome Agentailor Chat UI</h1>            <p className="text-lg mb-4 text-muted-foreground">
              A modern chat interface with real-time messaging and thread management. Need a backend? Create one at{' '}
              <a href="https://initializr.agentailor.com" className="text-primary hover:underline">initializr.agentailor.com</a>
            </p>
            <Button onClick={handleStartNewThread} size="lg" className="gap-2  cursor-pointer">
              {" "}
              <MessagesSquare className="w-5 h-5" />
              Start New Thread
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
