import { useState, useCallback, useEffect } from 'react';
import { fetchThreads, createNewThread } from '@/services/messageService';
import { Thread } from '@/types/message';
import { useRouter } from 'next/navigation';

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadThreads = useCallback(async () => {
    try {
      const loadedThreads = await fetchThreads();
      setThreads(loadedThreads);
      if (loadedThreads.length > 0 && !activeThreadId) {
        setActiveThreadId(loadedThreads[0].id);
      }
    } catch (error) {
      console.error('Failed to load threads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeThreadId]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const createThread = useCallback(async () => {
    try {
      const newThread = await createNewThread();
      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      router.push(`/?thread=${newThread.id}`);
      return newThread;
    } catch (error) {
      console.error('Failed to create thread:', error);
      throw error;
    }
  }, [router]);

  const switchThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    router.push(`/?thread=${threadId}`);
  }, [router]);

  return {
    threads,
    activeThreadId,
    isLoading,
    createThread,
    switchThread,
    refreshThreads: loadThreads,
  };
}
