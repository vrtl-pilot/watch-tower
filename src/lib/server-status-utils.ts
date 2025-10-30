// C# Enum Mappings are now handled by backend JSON serialization.

// These types must match the C# enum names serialized as strings: Running, Stopped, Degraded, Down
export type ServerStatusString = "Running" | "Stopped" | "Degraded";
export type ServiceStatusString = "Running" | "Stopped" | "Down" | "Degraded";

export interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: ServerStatusString;
  serviceStatus: ServiceStatusString;
}

/**
 * Ensures the server status object conforms to the ServerItem interface, 
 * assuming the raw data now contains string statuses.
 * @param rawServer The server item received directly from the API or SignalR.
 * @returns The formatted ServerItem.
 */
export const formatServerStatus = (rawServer: ServerItem): ServerItem => {
  // With backend JSON serialization configured, we expect string values.
  return rawServer;
};

/**
 * Converts an array of raw server data.
 * @param rawServers Array of raw server items.
 * @returns Array of formatted ServerItems.
 */
export const formatServerStatuses = (rawServers: ServerItem[]): ServerItem[] => {
  return rawServers;
};