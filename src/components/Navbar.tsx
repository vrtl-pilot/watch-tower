import { useState, useEffect } from 'react';
import { TowerControl, Menu } from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isCollapsed } = useSidebar();

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
    <header className="p-4 border-b bg-white dark:bg-gray-800 h-16">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
          <div className={cn("hidden md:flex items-center", !isCollapsed && "md:hidden")}>
            <TowerControl className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              WatchTower
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
            {formatTime(currentTime)}
          </div>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default Navbar;