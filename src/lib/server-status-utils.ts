// C# Enum Mappings are now handled by backend JSON serialization.

export interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: "Running" | "Stopped" | "Degraded";
  serviceStatus: "Running" | "Stopped" | "Down" | "Degraded";
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