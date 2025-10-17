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
  { name: "Web API Server 1", server: "prod-web-01", service: "User Service", status: "Running" },
  { name: "Web API Server 2", server: "prod-web-02", service: "Order Service", status: "Stopped" },
  { name: "Web API Server 3", server: "prod-web-03", service: "Product Service", status: "Running" },
];

const workerData = [
    { name: "Worker 1", server: "prod-worker-01", service: "Data Processing", status: "Running" },
    { name: "Worker 2", server: "prod-worker-02", service: "Email Notifications", status: "Running" },
];

const lighthouseData = [
    { name: "Lighthouse 1", server: "prod-lh-01", service: "Metrics & Logging", status: "Stopped" },
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