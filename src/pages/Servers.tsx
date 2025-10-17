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
import { showError, showSuccess, showLoading, dismissToast } from "@/utils/toast";
import { ENVIRONMENTS, DEFAULT_ENVIRONMENT } from "@/lib/constants";

interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: "Running" | "Stopped";
  serviceStatus: "Running" | "Stopped" | "Down";
}

const Servers = () => {
  const [environment, setEnvironment] = useState(DEFAULT_ENVIRONMENT.toLowerCase());
  const [webApiData, setWebApiData] = useState<ServerItem[]>([]);
  const [workerData, setWorkerData] = useState<ServerItem[]>([]);
  const [lighthouseData, setLighthouseData] = useState<ServerItem[]>([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch("/api/servers/all");

        if (!response.ok) {
          showError('Failed to fetch server data');
          throw new Error('Failed to fetch server data');
        }

        const allServers: ServerItem[] = await response.json();

        setWebApiData(allServers.filter(s => s.service === "Web API"));
        setWorkerData(allServers.filter(s => s.service === "Worker Service"));
        setLighthouseData(allServers.filter(s => s.service === "Lighthouse"));
      } catch (error) {
        console.error("Error fetching server data:", error);
        showError("An error occurred while fetching server data.");
      }
    };

    fetchServers();
  }, []);

  const handleAction = async (
    id: string,
    actionType: string,
    serverName: string,
    serviceName: string,
    setData: React.Dispatch<React.SetStateAction<ServerItem[]>>
  ) => {
    let loadingToastId: string | number | undefined;
    
    // Format actionType (e.g., 'startServer' -> 'start server')
    const actionDescription = actionType.replace(/([A-Z])/g, ' $1').toLowerCase();
    const targetName = actionType.includes('Server') ? serverName : serviceName;
    const loadingMessage = `Requesting ${actionDescription} for ${targetName}...`;

    try {
      // 1. Show persistent loading toast
      loadingToastId = showLoading(loadingMessage);

      // 2. Perform API call
      const response = await fetch('/api/servers/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, actionType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to perform server action');
      }

      const updatedServer: ServerItem = await response.json();

      // 3. Update local state
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, ...updatedServer } : item
        )
      );
      
      // 4. Show success notification
      const successMessage = `${targetName} on ${serverName} successfully updated. Status: ${updatedServer.serverStatus}/${updatedServer.serviceStatus}.`;
      showSuccess(successMessage);

    } catch (error: any) {
      console.error("Error performing server action:", error);
      // 4. Show error notification
      showError(error.message || `An error occurred while performing ${actionDescription} on ${targetName}.`);
    } finally {
      // 5. Dismiss loading toast
      if (loadingToastId) {
        dismissToast(loadingToastId as string);
      }
    }
  };

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
        <Card>
          <CardHeader>
            <CardTitle>Web API</CardTitle>
          </CardHeader>
          <CardContent>
            <ServerStatusTable
              data={webApiData}
              onAction={(id, actionType, serverName, serviceName) => handleAction(id, actionType, serverName, serviceName, setWebApiData)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worker</CardTitle>
          </CardHeader>
          <CardContent>
            <ServerStatusTable
              data={workerData}
              onAction={(id, actionType, serverName, serviceName) => handleAction(id, actionType, serverName, serviceName, setWorkerData)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LightHouse</CardTitle>
          </CardHeader>
          <CardContent>
            <ServerStatusTable
              data={lighthouseData}
              onAction={(id, actionType, serverName, serviceName) => handleAction(id, actionType, serverName, serviceName, setLighthouseData)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Servers;