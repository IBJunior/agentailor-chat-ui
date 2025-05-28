import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useThreads } from '@/hooks/useThreads';

export function ThreadList() {
  const { threads, activeThreadId, createThread, switchThread } = useThreads();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateThread = async () => {
    setIsCreating(true);
    try {
      await createThread();
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCreateThread}
          disabled={isCreating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5" />
          New Thread
        </button>
      </div>      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => switchThread(thread.id)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              thread.id === activeThreadId
                ? 'bg-gray-100 dark:bg-gray-800'
                : ''
            }`}
          >
            <div className="text-sm font-medium truncate">
              {thread.title || `Thread ${thread.id.slice(0, 8)}`}
            </div>
            {thread.lastMessage && (
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                {thread.lastMessage}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
