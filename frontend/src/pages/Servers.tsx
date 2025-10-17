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
  server: string;
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

  const handleAction = (
    id: string,
    newStatus: Partial<ServerItem>,
    setData: React.Dispatch<React.SetStateAction<ServerItem[]>>
  ) => {
    // NOTE: This only updates local state. A real implementation would
    // send a request to the backend to perform the action.
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, ...newStatus } : item
      )
    );
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
              onAction={(id, newStatus) => handleAction(id, newStatus, setWebApiData)}
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
              onAction={(id, newStatus) => handleAction(id, newStatus, setWorkerData)}
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
              onAction={(id, newStatus) => handleAction(id, newStatus, setLighthouseData)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Servers;