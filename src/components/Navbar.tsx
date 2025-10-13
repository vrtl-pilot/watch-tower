import { useState, useEffect } from 'react';
import { TowerControl } from 'lucide-react';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="p-4 border-b bg-white dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <TowerControl className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            WatchTower
          </h1>
        </div>
        <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {formatTime(currentTime)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;