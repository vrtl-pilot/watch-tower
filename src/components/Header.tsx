import { TowerControl } from "lucide-react";

const Header = () => {
  return (
    <header className="p-4 border-b bg-white dark:bg-gray-800">
      <div className="container mx-auto flex items-center">
        <TowerControl className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          WatchTower
        </h1>
      </div>
    </header>
  );
};

export default Header;