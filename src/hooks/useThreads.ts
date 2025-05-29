import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Thread } from '@/types/message';
import { useChatService } from '@/contexts/ChatServiceContext';
import { useThreadContext } from '@/contexts/ThreadContext';
import { useEffect, useCallback } from 'react';

export function useThreads() {
  const chatService = useChatService();
  const queryClient = useQueryClient();
  const { activeThreadId, setActiveThreadId } = useThreadContext();

  const {
    data: threads = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Thread[]>({
    queryKey: ['threads'],
    queryFn: () => chatService.fetchThreads(),
  });

  const invalidateMessages = useCallback((threadId: string) => {
    // Remove any existing messages from the cache
    queryClient.removeQueries({
      queryKey: ['messages', threadId]
    });
    // Force a refetch of messages for this thread
    queryClient.fetchQuery({
      queryKey: ['messages', threadId],
      queryFn: () => chatService.fetchMessageHistory(threadId)
    });
  }, [queryClient, chatService]);

  // If there's no active thread but we have threads, select the first one
  useEffect(() => {
    if (!activeThreadId && threads.length > 0) {
      const firstThreadId = threads[0].id;
      setActiveThreadId(firstThreadId);
      invalidateMessages(firstThreadId);
    }
  }, [activeThreadId, threads, setActiveThreadId, invalidateMessages]);

  const createThread = async () => {
    const newThread = await chatService.createNewThread();
    queryClient.setQueryData(['threads'], (old: Thread[] = []) => [newThread, ...old]);
    setActiveThreadId(newThread.id);
    invalidateMessages(newThread.id);
    return newThread;
  };

  const switchThread = (threadId: string) => {
    console.log(`Switching to thread: ${threadId}`);
    setActiveThreadId(threadId);
    invalidateMessages(threadId);
  };

  return {
    threads,
    activeThreadId,
    isLoading,
    error: error as Error | null,
    createThread,
    switchThread,
    refetchThreads: refetch,
  };
}
