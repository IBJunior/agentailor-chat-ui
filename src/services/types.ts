import type { Message, MessageDto, Thread } from "@/types/message";

/**
 * Interface for implementing a chat service backend.
 * This interface defines all the operations needed to integrate a custom backend with the chat UI.
 */
export type MessageStream = EventSource | WebSocket;

export interface IChatService {
  /**
   * Fetches the message history for a specific thread
   * @param threadId - The unique identifier of the thread
   * @returns Promise containing an array of messages
   */
  fetchMessageHistory(threadId: string): Promise<Message[]>;

  /**
   * Sends a new message to the backend
   * @param messageDto - The message data to send
   * @returns Promise containing the created message
   */
  sendMessage(messageDto: MessageDto): Promise<Message>;
  
  /**
   * Creates a stream connection for receiving real-time message updates
   * @param threadId - The unique identifier of the thread
   * @param message - The message content
   * @returns A streaming connection object (EventSource or WebSocket)
   */
  createMessageStream(threadId: string, message: string): MessageStream;

  /**
   * Closes an active message stream
   * @param stream - The stream connection to close (EventSource or WebSocket)
   */
  closeMessageStream(stream: MessageStream): Promise<void>;
  
  /**
   * Fetches all available chat threads
   * @returns Promise containing an array of threads
   */
  fetchThreads(): Promise<Thread[]>;

  /**
   * Creates a new chat thread
   * @returns Promise containing the created thread
   */
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
