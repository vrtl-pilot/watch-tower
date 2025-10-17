import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMigrationStore } from '@/hooks/use-migration-store';
import { toast } from 'sonner';

export const MigrationLogHandler = () => {
  const { logMessages } = useMigrationStore();
  const location = useLocation();
  const processedMessagesCount = useRef(logMessages.length);

  useEffect(() => {
    if (location.pathname !== '/migration') {
      const newMessages = logMessages.slice(processedMessagesCount.current);
      newMessages.forEach(message => {
        // Avoid showing toasts for initial connection status messages
        if (!message.startsWith('[INFO] SignalR Connected') && !message.startsWith('[ERROR] SignalR Connection Failed')) {
          toast.info("Migration Log", {
            description: message,
          });
        }
      });
    }
    processedMessagesCount.current = logMessages.length;
  }, [logMessages, location.pathname]);

  return null; // This component does not render anything
};