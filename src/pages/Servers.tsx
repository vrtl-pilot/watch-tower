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
import { showError } from "@/utils/toast";

interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: "Running" | "Stopped";
  serviceStatus: "Running" | "Stopped" | "Down";
}

const Servers = () => {
  const [environment, setEnvironment] = useState("prod");
  const [webApiData, setWebApiData] = useState<ServerItem[]>([]);
  const [workerData, setWorkerData] = useState<ServerItem[]>([]);
  const [lighthouseData, setLighthouseData] = useState<ServerItem[]>([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const [webApiResponse, workerResponse, lighthouseResponse] = await Promise.all([
          fetch("/api/servers/webapi"),
          fetch("/api/servers/worker"),
          fetch("/api/servers/lighthouse"),
        ]);

        if (!webApiResponse.ok || !workerResponse.ok || !lighthouseResponse.ok) {
          showError('Failed to fetch server data');
          throw new Error('Failed to fetch server data');
        }

        const webApiJson = await webApiResponse.json();
        const workerJson = await workerResponse.json();
        const lighthouseJson = await lighthouseResponse.json();

        setWebApiData(webApiJson);
        setWorkerData(workerJson);
        setLighthouseData(lighthouseJson);
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
    setData: React.Dispatch<React.SetStateAction<ServerItem[]>>
  ) => {
    try {
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

      const updatedServer = await response.json();

      // Update the state with the new data from the backend
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, ...updatedServer } : item
        )
      );
    } catch (error: any) {
      console.error("Error performing server action:", error);
      showError(error.message || "An error occurred while performing the action.");
    }
  };

  return (
    <div className="p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Servers</h2>
        <Select value={environment} onValueChange={setEnvironment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prod">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="dev">Development</SelectItem>
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
              onAction={(id, actionType) => handleAction(id, actionType, setWebApiData)}
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
              onAction={(id, actionType) => handleAction(id, actionType, setWorkerData)}
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
              onAction={(id, actionType) => handleAction(id, actionType, setLighthouseData)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Servers;