import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const queueData = [
  { name: "Large Worker Queue", value: 0 },
  { name: "Normal Worker Queue", value: 147 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"];

export const WorkerQueueInfo = () => {
  const total = queueData.reduce((acc, curr) => acc + curr.value, 0);
  const chartData = total > 0 ? queueData : [{ name: 'No data', value: 1 }];
  const chartColors = total > 0 ? COLORS : ["hsl(var(--muted))"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Current Worker Queue Info
        </CardTitle>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {total > 0 && (
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-2 bg-background border border-border rounded-md shadow-lg">
                            <p className="font-bold">{`${payload[0].name}`}</p>
                            <p>{`Count: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                )}
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={total > 0 ? 5 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
            </div>
          </div>
          <div className="space-y-4">
            {queueData.map((queue, index) => (
              <div key={queue.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <p className="text-sm font-medium">{queue.name}</p>
                </div>
                <p className="text-sm font-bold">{queue.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};