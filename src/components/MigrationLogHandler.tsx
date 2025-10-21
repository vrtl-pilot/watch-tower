import { useEffect, useRef } from 'react';
import { useMigrationStore } from '@/hooks/use-migration-store';
import { useNotificationStore } from '@/hooks/use-notification-store';

export const MigrationLogHandler = () => {
  const { logMessages } = useMigrationStore();
  const { addNotification } = useNotificationStore();
  // Use a ref to track the number of messages we've already processed and created notifications for.
  const processedCountRef = useRef(logMessages.length);

  useEffect(() => {
    // Check if there are new messages since the last check.
    if (logMessages.length > processedCountRef.current) {
      const newMessages = logMessages.slice(processedCountRef.current);
      
      newMessages.forEach(message => {
        // Avoid creating notifications for initial connection status messages
        if (!message.startsWith('[INFO] SignalR Connected') && !message.startsWith('[ERROR] SignalR Connection Failed')) {
          addNotification({
            title: "Migration Log",
            description: message,
            path: "/migration",
          });
        }
      });

      // Update the ref to the new length so we don't process these messages again.
      processedCountRef.current = logMessages.length;
    }
  }, [logMessages, addNotification]);

  return null; // This component does not render anything
};