// C# Enum Mappings - handle both string and numeric values for backward compatibility

// These types must match the C# enum names serialized as strings: Running, Stopped, Degraded, Down
export type ServerStatusString = "Running" | "Stopped" | "Degraded";
export type ServiceStatusString = "Running" | "Stopped" | "Down" | "Degraded";

// Numeric values matching C# enum defaults (Running=0, Stopped=1, Degraded=2 for ServerStatus; Running=0, Stopped=1, Down=2, Degraded=3 for ServiceStatus)
export type ServerStatusNumber = 0 | 1 | 2;
export type ServiceStatusNumber = 0 | 1 | 2 | 3;

export type ServerStatus = ServerStatusString | ServerStatusNumber;
export type ServiceStatus = ServiceStatusString | ServiceStatusNumber;

export interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: ServerStatus;
  serviceStatus: ServiceStatus;
}

// Mapping functions to convert numeric enums to strings
const serverStatusMap: Record<ServerStatusNumber, ServerStatusString> = {
  0: "Running",
  1: "Stopped",
  2: "Degraded"
};

const serviceStatusMap: Record<ServiceStatusNumber, ServiceStatusString> = {
  0: "Running",
  1: "Stopped",
  2: "Down",
  3: "Degraded"
};

/**
 * Converts a server status value (string or number) to string.
 * @param status The status value to convert.
 * @returns The status as a string.
 */
export const normalizeServerStatus = (status: ServerStatus): ServerStatusString => {
  if (typeof status === "string") {
    return status as ServerStatusString;
  }
  return serverStatusMap[status] || "Running"; // Default fallback
};

/**
 * Converts a service status value (string or number) to string.
 * @param status The status value to convert.
 * @returns The status as a string.
 */
export const normalizeServiceStatus = (status: ServiceStatus): ServiceStatusString => {
  if (typeof status === "string") {
    return status as ServiceStatusString;
  }
  return serviceStatusMap[status] || "Running"; // Default fallback
};

/**
 * Ensures the server status object conforms to the ServerItem interface with normalized string statuses.
 * @param rawServer The server item received directly from the API or SignalR.
 * @returns The formatted ServerItem with string statuses.
 */
export const formatServerStatus = (rawServer: ServerItem): ServerItem => {
  return {
    ...rawServer,
    serverStatus: normalizeServerStatus(rawServer.serverStatus),
    serviceStatus: normalizeServiceStatus(rawServer.serviceStatus)
  };
};

/**
 * Converts an array of raw server data to formatted ServerItems with string statuses.
 * @param rawServers Array of raw server items.
 * @returns Array of formatted ServerItems.
 */
export const formatServerStatuses = (rawServers: ServerItem[]): ServerItem[] => {
  return rawServers.map(formatServerStatus);
};