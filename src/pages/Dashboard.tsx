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

const webApiData = [
  { id: "web-1", server: "prod-web-01", service: "User Service", serverStatus: "Running" as const, serviceStatus: "Running" as const },
  { id: "web-2", server: "prod-web-02", service: "Order Service", serverStatus: "Running" as const, serviceStatus: "Down" as const },
  { id: "web-3", server: "prod-web-03", service: "Product Service", serverStatus: "Stopped" as const, serviceStatus: "Stopped" as const },
];

const workerData = [
    { id: "work-1", server: "prod-worker-01", service: "Data Processing", serverStatus: "Running" as const, serviceStatus: "Running" as const },
    { id: "work-2", server: "prod-worker-02", service: "Email Notifications", serverStatus: "Running" as const, serviceStatus: "Running" as const },
];

const lighthouseData = [
    { id: "lh-1", server: "prod-lh-01", service: "Metrics & Logging", serverStatus: "Stopped" as const, serviceStatus: "Stopped" as const },
];

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
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ServerStatusSummary title="Web API Status" data={webApiData} />
        <ServerStatusSummary title="Worker Status" data={workerData} />
        <ServerStatusSummary title="Lighthouse Status" data={lighthouseData} />
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
  );
};

export default Dashboard;