import { createContext, useContext, ReactNode } from "react";
import type { Message } from "@/types/message";
import { useMessages } from "@/hooks/useMessages";

interface ThreadContextType {
  messages: Message[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  threadId: string;
  sendMessage: (messageText: string) => Promise<void>;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export function useThread() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThread must be used within a ThreadProvider');
  }
  return context;
}

interface ThreadProviderProps {
  children: ReactNode;
  threadId?: string;
}

export function ThreadProvider({ children, threadId = "default1" }: ThreadProviderProps) {
  const {
    messages,
    isLoadingHistory,
    isSending,
    sendMessage
  } = useMessages(threadId);

  return (
    <ThreadContext.Provider 
      value={{
        messages,
        isLoading: isSending,
        isLoadingHistory,
        threadId,
        sendMessage,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
}
