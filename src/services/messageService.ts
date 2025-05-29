import type { Message, MessageDto, Thread } from "@/types/message";
import { IChatService, ChatServiceConfig } from "./types";

const DEFAULT_CONFIG: ChatServiceConfig = {
    baseUrl: 'http://localhost:3001/api/agent',
    endpoints: {
        history: '/history',
        chat: '/chat',
        stream: '/stream',
        threads: '/threads'
    }
};

export class DefaultChatService implements IChatService {
    private config: ChatServiceConfig;

    constructor(config: ChatServiceConfig = {}) {
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
            endpoints: {
                ...DEFAULT_CONFIG.endpoints,
                ...config.endpoints
            }
        };
    }

    private getUrl(endpoint: keyof Required<ChatServiceConfig>['endpoints']): string {
        return `${this.config.baseUrl}${this.config.endpoints?.[endpoint] || ''}`;
    }

    async fetchMessageHistory(threadId: string): Promise<Message[]> {
        console.log("Fetching message history for thread:", threadId);
        const response = await fetch(`${this.getUrl('history')}/${threadId}`, {
            headers: this.config.headers
        });
        if (!response.ok) {
            throw new Error('Failed to load history');
        }
        const data = await response.json();
        return data.map((msg: any) => ({
            id: msg.id || Date.now().toString(),
            type: msg.type,
            content: Array.isArray(msg.content) ? msg.content : [{ type: 'text', text: String(msg.content) }]
        }));
    }

    async sendMessage(messageDto: MessageDto): Promise<Message> {
        const response = await fetch(this.getUrl('chat'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.config.headers
            },
            body: JSON.stringify(messageDto),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();
        return {
            id: Date.now().toString(),
            type: data.type,
            content: Array.isArray(data.content) ? data.content : [{ type: 'text', text: String(data.content) }]
        };
    }    createMessageStream(threadId: string, message: string): EventSource {
        const params = new URLSearchParams({ content: message, threadId });
        return new EventSource(`${this.getUrl('stream')}?${params}`,{
           // withCredentials: true,
        });
    }

    async closeMessageStream(eventSource: EventSource): Promise<void> {
        eventSource.close();
    }

    async fetchThreads(): Promise<Thread[]> {
        const response = await fetch(this.getUrl('threads'), {
            headers: this.config.headers
        });
        if (!response.ok) {
            throw new Error('Failed to load threads');
        }
        return await response.json();
    }

    async createNewThread(): Promise<Thread> {
        const response = await fetch(this.getUrl('threads'), {
            method: 'POST',
            headers: this.config.headers
        });
        if (!response.ok) {
            throw new Error('Failed to create thread');
        }
        return await response.json();
    }
}

// Create a default instance for backward compatibility
const defaultService = new DefaultChatService();

// Export instance methods for backward compatibility
export const {
    fetchMessageHistory,
    sendMessage,
    createMessageStream,
    closeMessageStream,
    fetchThreads,
    createNewThread
} = defaultService;
