import { Bell, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotificationStore } from "@/hooks/use-notification-store";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell = () => {
  const { notifications, markAllAsRead, clearNotifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0) {
      setTimeout(() => markAllAsRead(), 1000); // Delay to allow popover to open
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-medium text-sm">Notifications</h4>
          {notifications.length > 0 && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearNotifications}>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <Link
                  to={notification.path}
                  className="block p-3 hover:bg-accent"
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    )}
                    <div className={cn("flex-1", notification.read && "pl-5")}>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No new notifications</p>
              <p className="text-xs text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};