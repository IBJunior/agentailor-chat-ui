import type { Message, MessageDto, Thread } from "@/types/message";

const API_BASE_URL = 'http://localhost:3001/api/agent';

export async function fetchMessageHistory(threadId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/history/${threadId}`);
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

export async function sendMessage(messageDto: MessageDto): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
}

export function createMessageStream(threadId: string, message: string): EventSource {
    const params = new URLSearchParams({ content: message, threadId, type: "humman" });
    const eventSource = new EventSource(`${API_BASE_URL}/stream?${params}`);
    return eventSource;
}

export async function closeMessageStream(eventSource: EventSource) {
    eventSource.close();
}

export async function fetchThreads(): Promise<Thread[]> {
    const response = await fetch(`${API_BASE_URL}/threads`);
    if (!response.ok) {
        throw new Error('Failed to load threads');
    }
    return await response.json();
}

export async function createNewThread(): Promise<Thread> {
    const response = await fetch(`${API_BASE_URL}/threads`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to create thread');
    }
    return await response.json();
}
