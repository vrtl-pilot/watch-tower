import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface ServerItem {
  id: string;
  server: string;
  service: string;
  serverStatus: "Running" | "Stopped";
  serviceStatus: "Running" | "Stopped" | "Down";
}

interface ServerStatusSummaryProps {
  title: string;
  data: ServerItem[];
}

type CombinedStatus = "Online" | "Offline" | "Service Down" | "Service Stopped";

const getCombinedStatus = (item: ServerItem): CombinedStatus => {
  if (item.serverStatus === "Stopped") return "Offline";
  if (item.serviceStatus === "Down") return "Service Down";
  if (item.serviceStatus === "Stopped") return "Service Stopped";
  return "Online";
};

const StatusBadge = ({ status }: { status: CombinedStatus }) => {
  const statusMap: Record<CombinedStatus, string> = {
    Online: "bg-green-600 hover:bg-green-600/80",
    Offline: "bg-gray-500 hover:bg-gray-500/80",
    "Service Down": "bg-yellow-500 hover:bg-yellow-500/80",
    "Service Stopped": "bg-red-600 hover:bg-red-600/80",
  };
  return (
    <Badge className={cn("text-white", statusMap[status])}>{status}</Badge>
  );
};

export const ServerStatusSummary = ({ title, data }: ServerStatusSummaryProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Button asChild variant="ghost" size="sm" className="-my-2 -mr-2">
          <Link to="/servers">
            Manage
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-2">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium leading-none">{item.server}</p>
                <p className="text-sm text-muted-foreground">{item.service}</p>
              </div>
              <StatusBadge status={getCombinedStatus(item)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};