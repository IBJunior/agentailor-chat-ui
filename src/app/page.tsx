"use client";
import { MainLayout } from "@/components/MainLayout";
import { Thread } from "@/components/Thread";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();
  const tempThreadId = uuidv4();

  const handleFirstMessage = async (message: string) => {
    router.replace(`/thread/${tempThreadId}?firstMessage=${encodeURIComponent(message)}`);
  };

  return (
    <MainLayout>
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl px-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to Chat</h1>
              <p className="text-muted-foreground mt-2">Start a new conversation by sending a message</p>
            </div>
            <Thread threadId={tempThreadId} onFirstMessage={handleFirstMessage} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
