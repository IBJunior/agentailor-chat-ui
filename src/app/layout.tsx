"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { ChatServiceProvider } from "@/contexts/ChatServiceContext";
import { ThreadProvider } from "@/contexts/ThreadContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ChatServiceProvider>
            <ThreadProvider>{children}</ThreadProvider>
          </ChatServiceProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
