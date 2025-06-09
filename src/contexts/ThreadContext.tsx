import React, { createContext, useContext, useState } from 'react';
import { Thread } from '@/types/message';

interface ThreadContextType {
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string) => void;
}

const ThreadContext = createContext<ThreadContextType | null>(null);

export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  return (
    <ThreadContext.Provider value={{ activeThreadId, setActiveThreadId }}>
      {children}
    </ThreadContext.Provider>
  );
}

export function useThreadContext() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThreadContext must be used within a ThreadProvider');
  }
  return context;
}
