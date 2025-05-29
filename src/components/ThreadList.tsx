"use client";

import { useState } from 'react';
import { useThreads } from '@/hooks/useThreads';
import { SquarePen } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function ThreadList() {
  const { threads, createThread } = useThreads();
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleCreateThread = async () => {
    setIsCreating(true);
    try {
      const newThread = await createThread();
      router.push(`/thread/${newThread.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <nav className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="px-2 py-2">
        <button
          onClick={handleCreateThread}
          disabled={isCreating}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
          New Thread
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 space-y-1">
          {threads.map((thread) => (
            <button              key={thread.id}
              onClick={() => router.push(`/thread/${thread.id}`)}
              className={`w-full flex flex-col items-start text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 transition-colors cursor-pointer ${
                pathname === `/thread/${thread.id}`
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <div className="text-sm font-medium truncate w-full">
                {thread.title || `Thread ${thread.id.slice(0, 8)}`}
              </div>
              {thread.lastMessage && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full mt-0.5">
                  {thread.lastMessage}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
