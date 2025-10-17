import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { showError } from "@/utils/toast";
import { RedisStatusCard } from "@/components/RedisStatusCard";
import { RedisMemoryChart } from "@/components/RedisMemoryChart";
import { RedisLatencyChart } from "@/components/RedisLatencyChart";
import { RedisKeyTable } from "@/components/RedisKeyTable";
import { Loader2 } from "lucide-react";

interface RedisInfo {
  status: string;
  uptime: string;
  connectedClients: number;
  totalKeys: number;
  persistenceStatus: string;
  hitRatio: number;
  usedMemoryBytes: number;
  maxMemoryBytes: number;
}

interface LatencyData {
  time: string;
  latencyMs: number;
}

const fetchRedisInfo = async (): Promise<RedisInfo> => {
  const response = await fetch("/api/redis/info");
  if (!response.ok) {
    throw new Error("Failed to fetch Redis info.");
  }
  return response.json();
};

const fetchLatencyData = async (): Promise<LatencyData[]> => {
  const response = await fetch("/api/redis/latency-data");
  if (!response.ok) {
    throw new Error("Failed to fetch Redis latency data.");
  }
  return response.json();
};

const Redis = () => {
  const { data: info, isLoading: isLoadingInfo, isError: isErrorInfo } = useQuery<RedisInfo>({
    queryKey: ['redisInfo'],
    queryFn: fetchRedisInfo,
    refetchInterval: 5000,
    onError: () => showError("Failed to load Redis instance information."),
  });

  const { data: latencyData, isLoading: isLoadingLatency, isError: isErrorLatency } = useQuery<LatencyData[]>({
    queryKey: ['redisLatency'],
    queryFn: fetchLatencyData,
    refetchInterval: 5000,
    onError: () => showError("Failed to load Redis latency data."),
  });

  const isLoading = isLoadingInfo || isLoadingLatency;
  const isError = isErrorInfo || isErrorLatency;

  if (isLoading) {
    return (
      <div className="p-8 pt-6 flex items-center justify-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !info || !latencyData) {
    return (
      <div className="p-8 pt-6 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Redis Management</h2>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">
              Could not connect to the Redis API endpoint or data is unavailable.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 pt-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Redis Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RedisStatusCard info={info} />
        <RedisMemoryChart 
          usedMemoryBytes={info.usedMemoryBytes} 
          maxMemoryBytes={info.maxMemoryBytes} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RedisLatencyChart data={latencyData} />
      </div>
      
      <RedisKeyTable />
    </div>
  );
};

export default Redis;