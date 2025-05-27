"use client";
import { Header } from "@/components/Header";
import { Thread } from "@/components/Thread";
import { ThreadProvider } from "@/contexts/ThreadContext";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Agent Chat" />
      <main className="flex-1 flex flex-col overflow-hidden mt-20">
        <ThreadProvider>
          <Thread />
        </ThreadProvider>
      </main>
    </div>
  );
}
