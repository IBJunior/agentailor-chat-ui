# Chat UI

A backend-agnostic chat UI built with Next.js and React that supports real-time messaging, thread management, and streaming responses.

## Demo

<video src="docs/chat-ui-demo.mp4" controls width="600" poster="public/next.svg">
  Your browser does not support the video tag. 
  <a href="docs/chat-ui-demo.mp4">Watch the demo video</a>
</video>

## Features

- 🌐 Backend agnostic - integrate with any chat backend
- 💬 Real-time messaging with streaming support
- 🧵 Thread management
- 🎨 Modern UI with dark mode support
- ⚡ Built with Next.js and React
- 🔌 Simple backend integration interface

## Quick Start

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Configure your backend URL:
```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-url/api/agent
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend Integration

The chat UI is designed to work with any backend implementation. Just implement the `IChatService` interface:

> 💡 Don't have a backend yet? Create a fully compatible NestJS + LangGraph backend for free at [initializr.agentailor.com](https://initializr.agentailor.com)

```typescript
interface IChatService {
  // Fetch message history for a thread
  fetchMessageHistory(threadId: string): Promise<Message[]>;
  
  // Send a new message
  sendMessage(messageDto: MessageDto): Promise<Message>;
  
  // Create a streaming connection for real-time updates
  createMessageStream(threadId: string, message: string): any;
  
  // Close a stream connection
  closeMessageStream(stream: any): Promise<void>;
  
  // Get all threads
  fetchThreads(): Promise<Thread[]>;
  
  // Create a new thread
  createNewThread(): Promise<Thread>;
}
```

### Example Backend Integration

1. Create your custom service implementation:

```typescript
import { IChatService, ChatServiceConfig } from './types';

export class CustomChatService implements IChatService {
  constructor(config: ChatServiceConfig = {}) {
    // Initialize with your configuration
  }

  async fetchMessageHistory(threadId: string): Promise<Message[]> {
    // Implement fetching messages from your backend
  }

  async sendMessage(messageDto: MessageDto): Promise<Message> {
    // Implement sending message to your backend
  }

  createMessageStream(threadId: string, message: string): any {
    // Implement streaming connection (EventSource, WebSocket, etc.)
  }

  async closeMessageStream(stream: any): Promise<void> {
    // Implement stream cleanup
  }

  async fetchThreads(): Promise<Thread[]> {
    // Implement fetching threads from your backend
  }

  async createNewThread(): Promise<Thread> {
    // Implement thread creation in your backend
  }
}
```

2. Configure the service in your app:

```typescript
import { CustomChatService } from './services/CustomChatService';

function App() {
  const customService = new CustomChatService({
    baseUrl: 'your-backend-url',
    // Add any custom configuration
  });

  return (
    <ChatServiceProvider service={customService}>
      <YourApp />
    </ChatServiceProvider>
  );
}
```

## API Endpoints

The default implementation expects these endpoints:

- `GET /api/history/:threadId` - Get message history
- `POST /api/chat` - Send a message
- `GET /api/stream` - SSE endpoint for streaming responses
- `GET /api/threads` - Get all threads
- `POST /api/threads` - Create a new thread

You can customize these endpoints through the `ChatServiceConfig`:

```typescript
const config: ChatServiceConfig = {
  baseUrl: 'http://your-backend-url',
  endpoints: {
    history: '/custom/history',
    chat: '/custom/chat',
    stream: '/custom/stream',
    threads: '/custom/threads'
  },
  headers: {
    'Authorization': 'Bearer your-token'
  }
};
```

## Learn More

This project is built with Next.js. To learn more about Next.js, take a look at:
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
