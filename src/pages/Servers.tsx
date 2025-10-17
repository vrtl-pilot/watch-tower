import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerStatusTable } from "@/components/ServerStatusTable";

const webApiData = [
  { server: "prod-web-01", service: "User Service", serverStatus: "Running", serviceStatus: "Running" },
  { server: "prod-web-02", service: "Order Service", serverStatus: "Running", serviceStatus: "Stopped" },
  { server: "prod-web-03", service: "Product Service", serverStatus: "Stopped", serviceStatus: "Stopped" },
];

const workerData = [
    { server: "prod-worker-01", service: "Data Processing", serverStatus: "Running", serviceStatus: "Running" },
    { server: "prod-worker-02", service: "Email Notifications", serverStatus: "Running", serviceStatus: "Running" },
];

const lighthouseData = [
    { server: "prod-lh-01", service: "Metrics & Logging", serverStatus: "Stopped", serviceStatus: "Stopped" },
];


const Servers = () => {
  const [environment, setEnvironment] = useState("prod");

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
            <ServerStatusTable data={webApiData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worker</CardTitle>
          </CardHeader>
          <CardContent>
            <ServerStatusTable data={workerData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LightHouse</CardTitle>
          </CardHeader>
          <CardContent>
            <ServerStatusTable data={lighthouseData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Servers;