import type { Message, MessageDto, Thread } from "@/types/message";

export interface IChatService {
  // Message operations
  fetchMessageHistory(threadId: string): Promise<Message[]>;
  sendMessage(messageDto: MessageDto): Promise<Message>;
  
  // Streaming operations
  createMessageStream(threadId: string, message: string): any; // Generic type for different streaming implementations
  closeMessageStream(stream: any): Promise<void>;
  
  // Thread operations
  fetchThreads(): Promise<Thread[]>;
  createNewThread(): Promise<Thread>;
}

export interface ChatServiceConfig {
  baseUrl?: string;
  endpoints?: {
    history?: string;
    chat?: string;
    stream?: string;
    threads?: string;
  };
  headers?: Record<string, string>;
}
