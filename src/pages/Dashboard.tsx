import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { RequestChart } from "@/components/RequestChart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, AlertTriangle, CheckCircle, ArrowUpRight } from "lucide-react";
import { WorkerQueueInfo } from "@/components/WorkerQueueInfo";
import { RequestStagesChart } from "@/components/RequestStagesChart";
import { EndpointBarChart } from "@/components/EndpointBarChart";
import { ServerStatusSummary } from "@/components/ServerStatusSummary";
import { showError } from "@/utils/toast";

interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: "Running" | "Stopped";
  serviceStatus: "Running" | "Stopped" | "Down";
}

const topErrorsByDescriptionData = [
  { endpoint: "Database connection timeout", value: "1,203 errors" },
  { endpoint: "Invalid API Key provided", value: "876 errors" },
  { endpoint: "User profile not found", value: "451 errors" },
  { endpoint: "Payment processing failed", value: "230 errors" },
  { endpoint: "Internal Server Error: Null pointer exception", value: "150 errors" },
];

const topEndpointsByRequestData = [
  { endpoint: "/api/v1/users", value: "250,123 requests" },
  { endpoint: "/api/v1/products", value: "180,456 requests" },
  { endpoint: "/api/v1/orders", value: "120,789 requests" },
  { endpoint: "/api/v1/auth/login", value: "95,321 requests" },
  { endpoint: "/api/v1/search", value: "78,910 requests" },
];

const Dashboard = () => {
  const [webApiData, setWebApiData] = useState<ServerItem[]>([]);
  const [workerData, setWorkerData] = useState<ServerItem[]>([]);
  const [lighthouseData, setLighthouseData] = useState<ServerItem[]>([]);

  useEffect(() => {
    const fetchServerStatuses = async () => {
      try {
        const [webApiResponse, workerResponse, lighthouseResponse] = await Promise.all([
          fetch("/api/servers/webapi"),
          fetch("/api/servers/worker"),
          fetch("/api/servers/lighthouse"),
        ]);

        if (!webApiResponse.ok || !workerResponse.ok || !lighthouseResponse.ok) {
          showError('Failed to fetch server status data for the dashboard.');
          return;
        }

        const webApiJson = await webApiResponse.json();
        const workerJson = await workerResponse.json();
        const lighthouseJson = await lighthouseResponse.json();

        setWebApiData(webApiJson);
        setWorkerData(workerJson);
        setLighthouseData(lighthouseJson);
      } catch (error) {
        console.error("Error fetching server statuses:", error);
        showError("An error occurred while fetching server statuses.");
      }
    };

    fetchServerStatuses();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select defaultValue="prod">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prod">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="dev">Development</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="last_60_mins">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_15_mins">Last 15 Mins</SelectItem>
              <SelectItem value="last_60_mins">Last 60 Mins</SelectItem>
              <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Requests"
              value="1,204,395"
              icon={Activity}
              change="+5.2%"
              changeType="increase"
            />
            <StatCard
              title="Success Rate"
              value="98.55%"
              icon={CheckCircle}
              change="-0.8%"
              changeType="decrease"
            />
            <StatCard
              title="Error Rate"
              value="1.45%"
              icon={AlertTriangle}
              change="+0.8%"
              changeType="increase"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <WorkerQueueInfo />
            <RequestStagesChart />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <RequestChart />
            <div className="grid gap-4 md:grid-cols-2">
              <EndpointBarChart
                title="🚨 Top Errors by Description"
                description="The most common error messages."
                data={topErrorsByDescriptionData}
              />
              <EndpointBarChart
                title="🚀 Top Endpoints by Request Count"
                description="The most frequently accessed endpoints."
                data={topEndpointsByRequestData}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-4">
          <ServerStatusSummary title="Web API Status" data={webApiData} />
          <ServerStatusSummary title="Worker Status" data={workerData} />
          <ServerStatusSummary title="Lighthouse Status" data={lighthouseData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;