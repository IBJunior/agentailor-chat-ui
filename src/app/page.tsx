"use client";
import { Thread } from "@/components/Thread";
import { MainLayout } from "@/components/MainLayout";
import { ThreadProvider } from "@/contexts/ThreadContext";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const threadId = searchParams.get("thread");

  return (
    <MainLayout>
      <ThreadProvider threadId={threadId ?? undefined}>
        <Thread />
      </ThreadProvider>
    </MainLayout>
  );
}
