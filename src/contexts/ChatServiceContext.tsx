import React, { createContext, useContext } from 'react';
import { IChatService } from '@/services/types';
import { DefaultChatService } from '@/services/messageService';

const ChatServiceContext = createContext<IChatService | null>(null);

export interface ChatServiceProviderProps {
    service?: IChatService;
    children: React.ReactNode;
}

export function ChatServiceProvider({ service = new DefaultChatService(), children }: ChatServiceProviderProps) {
    return (
        <ChatServiceContext.Provider value={service}>
            {children}
        </ChatServiceContext.Provider>
    );
}

export function useChatService(): IChatService {
    const context = useContext(ChatServiceContext);
    if (!context) {
        throw new Error('useChatService must be used within a ChatServiceProvider');
    }
    return context;
}
