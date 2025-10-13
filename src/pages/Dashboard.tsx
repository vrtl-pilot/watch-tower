import { StatCard } from "@/components/StatCard";
import { RequestChart } from "@/components/RequestChart";
import { EndpointTable } from "@/components/EndpointTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, AlertTriangle, CheckCircle, ArrowUpRight } from "lucide-react";

const topErrorsData = [
  { endpoint: "[POST] /api/v1/payment", value: "1,203 errors" },
  { endpoint: "[GET] /api/v1/user/:id", value: "876 errors" },
  { endpoint: "[PUT] /api/v1/inventory", value: "451 errors" },
  { endpoint: "[GET] /api/v1/products", value: "230 errors" },
];

const slowestEndpointsData = [
  { endpoint: "[GET] /api/v1/reports/generate", value: "1240ms" },
  { endpoint: "[POST] /api/v1/orders", value: "850ms" },
  { endpoint: "[GET] /api/v1/products/search", value: "780ms" },
  { endpoint: "[PUT] /api/v1/user/profile", value: "650ms" },
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4">
          <RequestChart />
        </div>
        <div className="col-span-1 lg:col-span-3 space-y-4">
          <EndpointTable
            title="🔥 Top Endpoints by Errors"
            description="The most frequently failing endpoints."
            data={topErrorsData}
          />
          <EndpointTable
            title="🐢 Slowest Endpoints"
            description="Endpoints with the highest p99 latency."
            data={slowestEndpointsData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;