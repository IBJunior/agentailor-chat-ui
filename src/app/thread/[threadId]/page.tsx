"use client";

import { Thread } from "@/components/Thread";
import { MainLayout } from "@/components/MainLayout";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMessages } from "@/hooks/useMessages";

export default function ThreadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const threadId = params.threadId as string;
  const firstMessage = searchParams.get('firstMessage');
  const { sendMessage } = useMessages(threadId);
  useEffect(() => {
    if (firstMessage) {
      sendMessage(firstMessage).catch((error) => {
        console.error('Failed to send first message:', error);
        // Optionally show an error toast/notification here
      });
      // Remove the firstMessage parameter from URL after sending
      router.replace(`/thread/${threadId}`);
    }
  }, [firstMessage, threadId, sendMessage, router]);

  return (
    <MainLayout>
      <Thread threadId={threadId} />
    </MainLayout>
  );
}
