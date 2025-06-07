"use client";

import { Thread } from "@/components/Thread";
import { MainLayout } from "@/components/MainLayout";
import { useParams } from "next/navigation";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
 
  return (
    <MainLayout>
      <Thread threadId={threadId} />
    </MainLayout>
  );
}
