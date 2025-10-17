import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Database, Users, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

interface RedisInfo {
  status: string;
  uptime: string;
  connectedClients: number;
  totalKeys: number;
  persistenceStatus: string;
  hitRatio: number;
}

interface RedisStatusCardProps {
  info: RedisInfo;
}

const formatRatio = (ratio: number) => (ratio * 100).toFixed(2) + "%";

export const RedisStatusCard = ({ info }: RedisStatusCardProps) => {
  const statusColor = info.status === "Running" ? "bg-green-600 hover:bg-green-600/80" : "bg-red-600 hover:bg-red-600/80";
  const persistenceColor = info.persistenceStatus === "OK" ? "bg-green-600 hover:bg-green-600/80" : "bg-red-600 hover:bg-red-600/80";

  const stats = [
    { title: "Connected Clients", value: info.connectedClients.toLocaleString(), icon: Users },
    { title: "Total Keys", value: info.totalKeys.toLocaleString(), icon: Database },
    { title: "Cache Hit Ratio", value: formatRatio(info.hitRatio), icon: CheckCircle },
    { title: "Uptime", value: info.uptime, icon: Clock },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Redis Instance Status
        </CardTitle>
        <Badge className={cn("text-white font-bold", statusColor)}>
          {info.status}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <stat.icon className="h-4 w-4 mr-1" />
                {stat.title}
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium">Persistence Status:</p>
          <Badge className={cn("text-white font-bold mt-1", persistenceColor)}>
            {info.persistenceStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};