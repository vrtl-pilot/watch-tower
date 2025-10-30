import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerStatusTable } from "@/components/ServerStatusTable";
import { showError, showLoading } from "@/utils/toast";
import { ENVIRONMENTS, DEFAULT_ENVIRONMENT } from "@/lib/constants";
import { useMigrationStore } from "@/hooks/use-migration-store";
import { ServerItem, formatServerStatuses, formatServerStatus } from "@/lib/server-status-utils";
import { Loader2 } from "lucide-react";

const Servers = () => {
  const [environment, setEnvironment] = useState(DEFAULT_ENVIRONMENT.toLowerCase());
  const [webApiData, setWebApiData] = useState<ServerItem[]>([]);
  const [workerData, setWorkerData] = useState<ServerItem[]>([]);
  const [lighthouseData, setLighthouseData] = useState<ServerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  
  const { connection, addServerActionToast, removeServerActionToast } = useMigrationStore();

  const updateServerData = (updatedServer: ServerItem) => {
    const setDataMap = {
      "Web API": setWebApiData,
      "Worker Service": setWorkerData,
      "Lighthouse": setLighthouseData,
    };
    
    const setData = setDataMap[updatedServer.service as keyof typeof setDataMap];
    
    if (setData) {
      setData(prevData =>
        prevData.map(item =>
          item.id === updatedServer.id ? updatedServer : item
        )
      );
    }
  };

  // Effect to handle initial data fetch
  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      try {
        // Removed client-side simulated delay, now handled by backend API

        const response = await fetch("/api/servers/all");

        if (!response.ok) {
          showError('Failed to fetch server data');
          throw new Error('Failed to fetch server data');
        }

        // API may return numeric or string statuses - formatServerStatuses handles both
        const rawServers: ServerItem[] = await response.json();
        console.log("Fetched server data from API:", rawServers);

        const allServers = formatServerStatuses(rawServers);

        setWebApiData(allServers.filter(s => s.service === "Web API"));
        setWorkerData(allServers.filter(s => s.service === "Worker Service"));
        setLighthouseData(allServers.filter(s => s.service === "Lighthouse"));
      } catch (error) {
        console.error("Error fetching server data:", error);
        showError("An error occurred while fetching server data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);
  
  // Effect to listen for SignalR updates
  useEffect(() => {
    if (connection) {
      // The backend may send numeric or string statuses via SignalR - formatServerStatus handles both
      const handler = (updatedServer: ServerItem) => {
        console.log("Received server update via SignalR:", updatedServer);
        const formattedServer = formatServerStatus(updatedServer);
        updateServerData(formattedServer);
        // The toast dismissal and success notification are handled in useMigrationStore
      };

      connection.on("ReceiveServerStatusUpdate", handler);

      return () => {
        connection.off("ReceiveServerStatusUpdate", handler);
      };
    }
  }, [connection]);


  const handleAction = async (
    id: string,
    actionType: string,
    serverName: string,
    serviceName: string,
  ) => {
    
    // Format actionType (e.g., 'startServer' -> 'start server')
    const actionDescription = actionType.replace(/([A-Z])/g, ' $1').toLowerCase();
    const targetName = actionType.includes('Server') ? serverName : serviceName;
    const loadingMessage = `Processing ${actionDescription} for ${targetName}...`;

    // 1. Show persistent loading toast and store its ID
    const loadingToastId = showLoading(loadingMessage);
    addServerActionToast(id, loadingToastId);

    try {
      // 2. Perform API call (which now returns 202 Accepted immediately)
      const response = await fetch('/api/servers/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, actionType }),
      });

      if (!response.ok && response.status !== 202) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate server action');
      }
      
      // Success message is handled by SignalR listener upon completion.
      // If the API call fails to initiate (e.g., 400/500 status), the catch block handles it.

    } catch (error: any) {
      console.error("Error initiating server action:", error);
      // If initiation fails, dismiss the toast immediately and show an error.
      removeServerActionToast(id);
      showError(error.message || `An error occurred while initiating ${actionDescription} on ${targetName}.`);
    }
  };

  const renderServerContent = (data: ServerItem[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ServerStatusTable
            data={data}
            onAction={(id, actionType, serverName, serviceName) => handleAction(id, actionType, serverName, serviceName)}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Servers</h2>
        <Select value={environment} onValueChange={(value) => setEnvironment(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            {ENVIRONMENTS.map(env => (
              <SelectItem key={env} value={env.toLowerCase()}>{env}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {renderServerContent(webApiData, "Web API")}
        {renderServerContent(workerData, "Worker")}
        {renderServerContent(lighthouseData, "LightHouse")}
      </div>
    </div>
  );
};

export default Servers;