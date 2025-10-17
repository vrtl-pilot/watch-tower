import { create } from 'zustand';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from 'sonner'; // Import sonner toast for dismissal
import { useNotificationStore } from './use-notification-store'; // Import the notification store

export interface MigrationItem {
  id: number;
  fundName: string;
  dateType: "historical" | "oneDay" | "range";
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  env: string;
}

// Define the Server type for the SignalR payload
interface Server {
  id: string;
  serverName: string;
  service: string;
  serverStatus: "Running" | "Stopped" | "Degraded";
  serviceStatus: "Running" | "Stopped" | "Down" | "Degraded";
}

interface MigrationState {
  migrations: MigrationItem[];
  selectedItems: number[];
  enqueuedIds: number[];
  logMessages: string[];
  activeServerActions: Record<string, string | number>; // { serverId: toastId }
  connection: HubConnection | null;
  initializeConnection: () => void;
  addMigration: (item: MigrationItem) => void;
  removeMigrations: (ids: number[]) => void;
  updateMigration: (id: number, data: Partial<MigrationItem>) => void;
  toggleSelection: (id: number) => void;
  selectAll: (allIds: number[]) => void;
  deselectAll: () => void;
  setEnqueued: (ids: number[]) => void;
  clearQueue: () => void;
  addServerActionToast: (serverId: string, toastId: string | number) => void;
  removeServerActionToast: (serverId: string) => void;
}

const sampleMigrations: MigrationItem[] = [
  { id: 1, fundName: "Global Tech Leaders Fund", dateType: "oneDay", date: new Date("2023-10-26"), env: "production" },
  { id: 2, fundName: "Sustainable Energy Fund", dateType: "range", startDate: new Date("2023-10-01"), endDate: new Date("2023-10-07"), env: "qa01" },
  { id: 3, fundName: "Emerging Markets Growth", dateType: "historical", env: "test01" },
  { id: 4, fundName: "US Blue Chip Equity Fund", dateType: "oneDay", date: new Date("2023-10-25"), env: "production" },
  { id: 5, fundName: "European Dividend Aristocrats", dateType: "range", startDate: new Date("2023-09-15"), endDate: new Date("2023-09-20"), env: "qa02" },
  { id: 6, fundName: "Healthcare Innovation Fund", dateType: "oneDay", date: new Date("2023-10-24"), env: "development" },
  { id: 7, fundName: "Real Estate Investment Trust (REIT)", dateType: "historical", env: "production" },
  { id: 8, fundName: "Asia Pacific Tigers Fund", dateType: "oneDay", date: new Date("2023-10-23"), env: "test02" },
  { id: 9, fundName: "Corporate Bond Index Fund", dateType: "range", startDate: new Date("2023-10-10"), endDate: new Date("2023-10-15"), env: "production" },
  { id: 10, fundName: "Small Cap Value Fund", dateType: "oneDay", date: new Date("2023-10-22"), env: "qa01" },
  { id: 11, fundName: "Global Infrastructure Fund", dateType: "historical", env: "development" },
  { id: 12, fundName: "Latin America Opportunities", dateType: "range", startDate: new Date("2023-08-01"), endDate: new Date("2023-08-31"), env: "production" },
  { id: 13, fundName: "Biotechnology Breakthroughs", dateType: "oneDay", date: new Date("2023-10-21"), env: "test01" },
  { id: 14, fundName: "FTSE 100 Index Tracker", dateType: "historical", env: "production" },
  { id: 15, fundName: "S&P 500 Low Volatility Fund", dateType: "range", startDate: new Date("2023-10-01"), endDate: new Date("2023-10-31"), env: "qa02" },
];

export const useMigrationStore = create<MigrationState>((set, get) => ({
  migrations: sampleMigrations,
  selectedItems: [],
  enqueuedIds: [],
  logMessages: [],
  activeServerActions: {},
  connection: null,

  addServerActionToast: (serverId, toastId) => set((state) => ({
    activeServerActions: { ...state.activeServerActions, [serverId]: toastId }
  })),

  removeServerActionToast: (serverId) => set((state) => {
    const newActions = { ...state.activeServerActions };
    delete newActions[serverId];
    return { activeServerActions: newActions };
  }),

  initializeConnection: () => {
    if (get().connection) return;
    
    const newConnection = new HubConnectionBuilder()
      .withUrl("/migrationhub")
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveLogMessage", (message) => {
      set((state) => ({ logMessages: [...state.logMessages, message] }));
    });

    newConnection.on("ReceiveServerStatusUpdate", (server: Server) => {
      const { activeServerActions, removeServerActionToast } = get();
      const toastId = activeServerActions[server.id];
      const addNotification = useNotificationStore.getState().addNotification; // Get current state function

      if (toastId) {
        // 1. Dismiss the loading toast
        toast.dismiss(toastId);
        removeServerActionToast(server.id);

        // 2. Prepare messages
        const successMessage = `${server.service} on ${server.serverName} successfully updated. Status: ${server.serverStatus}/${server.serviceStatus}.`;
        
        // 3. Show ephemeral toast notification
        toast.success("Server Action Complete", { description: successMessage });

        // 4. Add persistent notification to the bell icon
        addNotification({
          title: "Server Status Update",
          description: successMessage,
          path: "/servers",
        });
      }
      
      // Note: The Servers.tsx page handles updating its local state based on this SignalR message
    });

    newConnection.start()
      .then(() => set((state) => ({ logMessages: [...state.logMessages, "[INFO] SignalR Connected."] })))
      .catch(err => {
        console.error("SignalR Connection Error: ", err);
        set((state) => ({ logMessages: [...state.logMessages, `[ERROR] SignalR Connection Failed: ${err}`] }));
      });
      
    set({ connection: newConnection });
  },

  addMigration: (item) => set((state) => ({ migrations: [...state.migrations, item] })),

  removeMigrations: (idsToRemove) => set((state) => ({
    migrations: state.migrations.filter(item => !idsToRemove.includes(item.id)),
    selectedItems: state.selectedItems.filter(id => !idsToRemove.includes(id)),
  })),

  updateMigration: (id, data) => set((state) => ({
    migrations: state.migrations.map(item => item.id === id ? { ...item, ...data } as MigrationItem : item),
  })),

  toggleSelection: (id) => set((state) => ({
    selectedItems: state.selectedItems.includes(id)
      ? state.selectedItems.filter(itemId => itemId !== id)
      : [...state.selectedItems, id],
  })),
  
  selectAll: (allIds) => set({ selectedItems: allIds }),
  
  deselectAll: () => set({ selectedItems: [] }),

  setEnqueued: (ids) => set((state) => ({ enqueuedIds: [...state.enqueuedIds, ...ids] })),

  clearQueue: () => set({
    migrations: [],
    selectedItems: [],
    enqueuedIds: [],
  }),
}));