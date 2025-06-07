import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useEffect, useState } from "react";
import type { Message, SseMessageData, MessageContentDto, Thread } from "@/types/message";
import { useChatService } from "@/contexts/ChatServiceContext";
import { useThreadContext } from '@/contexts/ThreadContext';


interface UseChatReturn {
    // Message-related
    messages: Message[];
    isLoadingHistory: boolean;
    isSending: boolean;
    historyError: Error | null;
    sendError: Error | null;
    sendMessage: (messageText: string) => Promise<void>;
    refetchMessages: () => Promise<unknown>;

    // Thread-related
    threads: Thread[];
    activeThreadId: string | null;
    isLoadingThreads: boolean;
    threadError: Error | null;
    createThread: () => Promise<Thread>;
    switchThread: (threadId: string) => void;
    refetchThreads: () => Promise<unknown>;
}

export function useChat(threadId: string | null = null): UseChatReturn {
    const chatService = useChatService();
    const queryClient = useQueryClient();
    const { activeThreadId, setActiveThreadId } = useThreadContext();
    const streamRef = useRef<any>(null);
    const currentMessageRef = useRef<Message | null>(null);
    const [sendError, setSendError] = useState<Error | null>(null);
    const [isSending, setIsSending] = useState(false);

    // Query for threads
    const {
        data: threads = [],
        isLoading: isLoadingThreads,
        error: threadError,
        refetch: refetchThreadsQuery,
    } = useQuery<Thread[]>({
        queryKey: ['threads'],
        queryFn: () => chatService.fetchThreads(),
    });

    // Query for message history
    const {
        data: messages = [],
        isLoading: isLoadingHistory,
        error: historyError,
        refetch: refetchMessagesQuery
    } = useQuery({
        queryKey: ['messages', threadId],
        queryFn: () => {
            if (!threadId) {
                return Promise.resolve([]);
            }
            return chatService.fetchMessageHistory(threadId);
        },
        enabled: !!threadId
    });

    const invalidateMessages = useCallback((threadId: string) => {
        queryClient.removeQueries({
            queryKey: ['messages', threadId]
        });
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
        const newThread = {
            id: crypto.randomUUID(),
            title: '',

        } as Thread;
        newThread.title = newThread.id;
        queryClient.setQueryData(['threads'], (old: Thread[] = []) => [newThread, ...old]);
        setActiveThreadId(newThread.id);
        invalidateMessages(newThread.id);
        return Promise.resolve(newThread);
    };

    const switchThread = (threadId: string) => {
        setActiveThreadId(threadId);
    
        invalidateMessages(threadId);
    };

    const sendMessage = useCallback(async (messageText: string): Promise<void> => {
        const threadIdToUse = threadId || crypto.randomUUID();

        setIsSending(true);
        setSendError(null);

        try {            const tempId = `temp-${Date.now()}`;
            const userMessage: Message = {
                id: tempId,
                type: 'human',
                content: [{ type: 'text', text: messageText }]
            };

            queryClient.setQueryData(['messages', threadIdToUse], (old: Message[] = []) => [...old, userMessage]);

            if (streamRef.current) {
                await chatService.closeMessageStream(streamRef.current);
            }

            const stream = chatService.createMessageStream(threadIdToUse, messageText);
            streamRef.current = stream;

            if ('onmessage' in stream) {
                stream.onmessage = (event: MessageEvent) => {
                    try {
                        const data = JSON.parse(event.data) as SseMessageData;

                        if (!currentMessageRef.current || currentMessageRef.current.id !== data.id) {
                            const newContent: MessageContentDto = { type: 'text', text: data.content };
                            currentMessageRef.current = {
                                id: data.id,
                                type: data.type,
                                content: [newContent]
                            };
                            queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => [...old, currentMessageRef.current!]);
                        } else {
                            const updatedContent: MessageContentDto = {
                                type: 'text',
                                text: currentMessageRef.current.content[0].text + data.content
                            };

                            const updatedMessage: Message = {
                                ...currentMessageRef.current,
                                content: [updatedContent]
                            };
                            currentMessageRef.current = updatedMessage;

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

    return {
        // Message-related
        messages,
        isLoadingHistory,
        isSending,
        historyError: historyError as Error | null,
        sendError,
        sendMessage,
        refetchMessages: refetchMessagesQuery,

        // Thread-related
        threads,
        activeThreadId,
        isLoadingThreads,
        threadError: threadError as Error | null,
        createThread,
        switchThread,
        refetchThreads: refetchThreadsQuery,
    };
}
