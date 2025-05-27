import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useEffect, useState } from "react";
import type { Message, SseMessageData, MessageContentDto } from "@/types/message";
import { fetchMessageHistory, createMessageStream, closeMessageStream } from "@/services/messageService";

interface UseMessagesReturn {
  messages: Message[];
  isLoadingHistory: boolean;
  isSending: boolean;
  historyError: Error | null;
  sendError: Error | null;
  sendMessage: (messageText: string) => Promise<void>;
  refetchMessages: () => Promise<void>;
}

export function useMessages(threadId: string): UseMessagesReturn {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentMessageRef = useRef<Message | null>(null);
  const [sendError, setSendError] = useState<Error | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Query for message history
  const { 
    data: messages = [], 
    isLoading: isLoadingHistory,
    error: historyError,
    refetch
  } = useQuery({
    queryKey: ['messages', threadId],
    queryFn: () => fetchMessageHistory(threadId)
  });

  const sendMessage = useCallback(async (messageText: string): Promise<void> => {
    setIsSending(true);
    setSendError(null);
    
    try {
      // Add user message to the chat immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'human',
        content: [{ type: 'text', text: messageText }]
      };
      queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => [...old, userMessage]);

      // Close any existing stream
      if (eventSourceRef.current) {
        closeMessageStream(eventSourceRef.current);
      }

      // Create new stream
      const eventSource = createMessageStream(threadId, messageText);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SseMessageData;

          // If we don't have a current message or the ID changed, create a new message
          if (!currentMessageRef.current || currentMessageRef.current.id !== data.id) {
            const newContent: MessageContentDto = { type: 'text', text: data.content };
            currentMessageRef.current = {
              id: data.id,
              type: data.type,
              content: [newContent]
            };
            // Add new message to the chat
            queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => [...old, currentMessageRef.current!]);
          } else {
            // Update existing message content by appending new content
            const updatedContent: MessageContentDto = {
              type: 'text',
              text: currentMessageRef.current.content[0].text + data.content
            };
            
            const updatedMessage: Message = {
              ...currentMessageRef.current,
              content: [updatedContent]
            };
            currentMessageRef.current = updatedMessage;

            // Update the message in the chat
            queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => {
              const index = old.findIndex(msg => msg.id === data.id);
              if (index === -1) return old;
              const newMessages = [...old];
              newMessages[index] = updatedMessage;
              return newMessages;
            });
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error, event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        setSendError(new Error('Failed to receive message stream'));
        setIsSending(false);
        currentMessageRef.current = null;
        if (eventSourceRef.current) {
          closeMessageStream(eventSourceRef.current);
          eventSourceRef.current = null;
        }
      };

      // Handle stream end
      eventSource.addEventListener('done', () => {
        setIsSending(false);
        currentMessageRef.current = null;
        closeMessageStream(eventSource);
        eventSourceRef.current = null;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setSendError(error as Error);
      setIsSending(false);
      currentMessageRef.current = null;
    }
  }, [threadId, queryClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        closeMessageStream(eventSourceRef.current);
      }
    };
  }, []);

  const refetchMessages = async (): Promise<void> => {
    await refetch();
  };

  return {
    messages,
    isLoadingHistory,
    isSending,
    historyError: historyError as Error | null,
    sendError,
    sendMessage,
    refetchMessages
  };
}
