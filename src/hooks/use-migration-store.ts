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

const sampleMigrations: MigrationItem[] = [
  { id: 1, fundName: "Global Tech Leaders Fund", dateType: "oneDay", date: new Date("2023-10-26"), env: "prod" },
  { id: 2, fundName: "Sustainable Energy Fund", dateType: "range", startDate: new Date("2023-10-01"), endDate: new Date("2023-10-07"), env: "prod" },
  { id: 3, fundName: "Emerging Markets Growth", dateType: "historical", env: "staging" },
  { id: 4, fundName: "US Blue Chip Equity Fund", dateType: "oneDay", date: new Date("2023-10-25"), env: "prod" },
  { id: 5, fundName: "European Dividend Aristocrats", dateType: "range", startDate: new Date("2023-09-15"), endDate: new Date("2023-09-20"), env: "prod" },
  { id: 6, fundName: "Healthcare Innovation Fund", dateType: "oneDay", date: new Date("2023-10-24"), env: "dev" },
  { id: 7, fundName: "Real Estate Investment Trust (REIT)", dateType: "historical", env: "prod" },
  { id: 8, fundName: "Asia Pacific Tigers Fund", dateType: "oneDay", date: new Date("2023-10-23"), env: "staging" },
  { id: 9, fundName: "Corporate Bond Index Fund", dateType: "range", startDate: new Date("2023-10-10"), endDate: new Date("2023-10-15"), env: "prod" },
  { id: 10, fundName: "Small Cap Value Fund", dateType: "oneDay", date: new Date("2023-10-22"), env: "prod" },
  { id: 11, fundName: "Global Infrastructure Fund", dateType: "historical", env: "dev" },
  { id: 12, fundName: "Latin America Opportunities", dateType: "range", startDate: new Date("2023-08-01"), endDate: new Date("2023-08-31"), env: "prod" },
  { id: 13, fundName: "Biotechnology Breakthroughs", dateType: "oneDay", date: new Date("2023-10-21"), env: "staging" },
  { id: 14, fundName: "FTSE 100 Index Tracker", dateType: "historical", env: "prod" },
  { id: 15, fundName: "S&P 500 Low Volatility Fund", dateType: "range", startDate: new Date("2023-10-01"), endDate: new Date("2023-10-31"), env: "prod" },
];

export const useMigrationStore = create<MigrationState>((set, get) => ({
  migrations: sampleMigrations,
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