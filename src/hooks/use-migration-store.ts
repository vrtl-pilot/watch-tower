import { create } from 'zustand';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export interface MigrationItem {
  id: number;
  fundName: string;
  dateType: "historical" | "oneDay" | "range";
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  env: string;
}

interface MigrationState {
  migrations: MigrationItem[];
  selectedItems: number[];
  enqueuedIds: number[];
  logMessages: string[];
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
}

export const useMigrationStore = create<MigrationState>((set, get) => ({
  migrations: [
    { id: 1, fundName: "Sample Fund A", dateType: "oneDay", date: new Date(), env: "prod" },
    { id: 2, fundName: "Sample Fund B", dateType: "range", startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 7)), env: "prod" },
  ],
  selectedItems: [],
  enqueuedIds: [],
  logMessages: [],
  connection: null,

  initializeConnection: () => {
    if (get().connection) return;
    
    const newConnection = new HubConnectionBuilder()
      .withUrl("/migrationhub")
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveLogMessage", (message) => {
      set((state) => ({ logMessages: [...state.logMessages, message] }));
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