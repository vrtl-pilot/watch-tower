// C# Enum Mappings (based on backend/WatchTower/WatchTower.API/Models/Server.cs)

export interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: "Running" | "Stopped" | "Degraded";
  serviceStatus: "Running" | "Stopped" | "Down" | "Degraded";
}

const SERVER_STATUS_MAP: Record<number, ServerItem['serverStatus']> = {
  0: "Running",
  1: "Stopped",
  2: "Degraded",
};

const SERVICE_STATUS_MAP: Record<number, ServerItem['serviceStatus']> = {
  0: "Running",
  1: "Stopped",
  2: "Down",
  3: "Degraded",
};

// Define the raw data structure received from the API
interface RawServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: number;
  serviceStatus: number;
}

/**
 * Converts raw server data (with numerical status codes) into the frontend ServerItem format (with string status literals).
 * @param rawServer The server item received directly from the API.
 * @returns The formatted ServerItem.
 */
export const formatServerStatus = (rawServer: RawServerItem): ServerItem => {
  const serverStatusString = SERVER_STATUS_MAP[rawServer.serverStatus] || "Stopped";
  const serviceStatusString = SERVICE_STATUS_MAP[rawServer.serviceStatus] || "Down";

  // Explicitly construct the object to ensure string statuses are used, 
  // avoiding potential issues with property order in the spread operator.
  return {
    id: rawServer.id,
    serverName: rawServer.serverName,
    service: rawServer.service,
    serverStatus: serverStatusString,
    serviceStatus: serviceStatusString,
  };
};

/**
 * Converts an array of raw server data.
 * @param rawServers Array of raw server items.
 * @returns Array of formatted ServerItems.
 */
export const formatServerStatuses = (rawServers: RawServerItem[]): ServerItem[] => {
  return rawServers.map(formatServerStatus);
};