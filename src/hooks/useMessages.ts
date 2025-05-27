import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message, MessageDto } from "@/types/message";
import { fetchMessageHistory, sendMessage as sendMessageApi } from "@/services/messageService";

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

  // Mutation for sending messages
  const { 
    mutateAsync: sendMessageMutation, 
    isPending: isSending,
    error: sendError 
  } = useMutation({
    mutationFn: async (messageText: string) => {
      // Optimistically add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'human',
        content: [{ type: 'text', text: messageText }]
      };

      // Update cache immediately with user message
      queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => [...old, userMessage]);

      // Send message to API
      const messageDto: MessageDto = {
        threadId,
        type: 'human',
        content: [{ type: 'text', text: messageText }]
      };

      const response = await sendMessageApi(messageDto);

      // Update cache with AI response
      queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => [...old, response]);

      return response;
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      // Roll back the optimistic update
      queryClient.invalidateQueries({ queryKey: ['messages', threadId] });
    }
  });

  const sendMessage = async (messageText: string): Promise<void> => {
    await sendMessageMutation(messageText);
  };

  const refetchMessages = async (): Promise<void> => {
    await refetch();
  };

  return {
    messages,
    isLoadingHistory,
    isSending,
    historyError: historyError as Error | null,
    sendError: sendError as Error | null,
    sendMessage,
    refetchMessages
  };
}
