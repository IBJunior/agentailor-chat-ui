import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useEffect, useState } from "react";
import type { Message, SseMessageData, MessageContentDto } from "@/types/message";
import { useChatService } from "@/contexts/ChatServiceContext";

interface UseMessagesOptions {
  skipLocalUpdate?: boolean;
}

interface UseMessagesReturn {
  messages: Message[];
  isLoadingHistory: boolean;
  isSending: boolean;
  historyError: Error | null;
  sendError: Error | null;
  sendMessage: (messageText: string) => Promise<void>;
  refetchMessages: () => Promise<void>;
}

export function useMessages(threadId: string | null, options: UseMessagesOptions = {}): UseMessagesReturn {
  const chatService = useChatService();
  const queryClient = useQueryClient();
  const streamRef = useRef<any>(null);
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
    queryFn: () => {
      console.log(`Fetching message history for thread: ${threadId}`);
      if (!threadId) {
        return Promise.resolve([]);
      }
      return chatService.fetchMessageHistory(threadId);
    },
    enabled: !!threadId // Only run the query if we have a threadId
  });

  const sendMessage = useCallback(async (messageText: string): Promise<void> => {
    // if no threadId, then create a new thread using uuid
    const threadIdToUse = threadId || crypto.randomUUID();

    setIsSending(true);
    setSendError(null);      try {      if (!options.skipLocalUpdate) {
        // Use a temporary frontend ID for immediate display
        const tempId = `temp-${Date.now()}`;
        const userMessage: Message = {
          id: tempId,
          type: 'human',
          content: [{ type: 'text', text: messageText }]
        };

        queryClient.setQueryData(['messages', threadIdToUse], (old: Message[] = []) => [...old, userMessage]);
      }

      // Close any existing stream
      if (streamRef.current) {
        await chatService.closeMessageStream(streamRef.current);
      }

      // Create new stream
      const stream = chatService.createMessageStream(threadIdToUse, messageText);
      streamRef.current = stream;

      if ('onmessage' in stream) {
        stream.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data) as SseMessageData;            // If we don't have a current message or the ID changed, create a new message
            if (!currentMessageRef.current || currentMessageRef.current.id !== data.id) {
              const newContent: MessageContentDto = { type: 'text', text: data.content };
              currentMessageRef.current = {
                id: data.id, // Use the ID from the backend
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
            console.error('Error parsing message:', error, event.data);
          }
        };

        stream.onerror = (error: Event) => {
          console.error('Stream Error:', error);
          setSendError(new Error('Failed to receive message stream'));
          setIsSending(false);
          currentMessageRef.current = null;
          if (streamRef.current) {
            chatService.closeMessageStream(streamRef.current);
            streamRef.current = null;
          }
        };

        if ('addEventListener' in stream) {
          stream.addEventListener('done', async () => {
            setIsSending(false);
            currentMessageRef.current = null;
            await chatService.closeMessageStream(stream);
            streamRef.current = null;
          });
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setSendError(error as Error);
      setIsSending(false);
      currentMessageRef.current = null;
    }
  }, [threadId, queryClient, chatService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        chatService.closeMessageStream(streamRef.current).catch(console.error);
        streamRef.current = null;
      }
    };
  }, [chatService]);

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
