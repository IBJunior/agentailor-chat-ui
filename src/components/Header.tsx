interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <header className="backdrop-blur-md bg-background/75 w-full border-b border-gray-200/20 dark:border-gray-800/20">
      <div className="p-4 flex items-center gap-4">
        <div className="flex items-center gap-4">
          {children}
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Agent Chat
        </h1>
      </div>
    </header>
  );
};
