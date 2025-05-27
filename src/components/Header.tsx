interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <header className="backdrop-blur-md bg-background/75 fixed w-full top-0 z-10 border-b border-gray-200/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
    </header>
  );
};
