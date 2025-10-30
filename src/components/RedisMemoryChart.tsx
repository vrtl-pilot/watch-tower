import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RedisMemoryChartProps {
  usedMemoryBytes: number;
  maxMemoryBytes: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const RedisMemoryChart = ({ usedMemoryBytes, maxMemoryBytes }: RedisMemoryChartProps) => {
  const availableMemoryBytes = maxMemoryBytes - usedMemoryBytes;
  const totalMemory = maxMemoryBytes;

  const data = [
    { name: "Used Memory", value: usedMemoryBytes },
    { name: "Available Memory", value: availableMemoryBytes },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"];

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Memory Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const entry = payload[0].payload;
                    return (
                      <div className="p-2 bg-background border border-border rounded-md shadow-lg">
                        <p className="font-bold">{`${entry.name}`}</p>
                        <p>{`${formatBytes(entry.value)}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold">{formatBytes(usedMemoryBytes)}</p>
            <p className="text-xs text-muted-foreground">of {formatBytes(totalMemory)}</p>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <p className="text-sm font-medium">{item.name}</p>
              </div>
              <p className="text-sm font-bold">{formatBytes(item.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};