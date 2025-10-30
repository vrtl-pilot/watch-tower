import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TooltipProps } from "recharts";

interface LatencyData {
  time: string;
  latencyMs: number;
}

interface RedisLatencyChartProps {
  data: LatencyData[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border border-border rounded-md shadow-lg">
        <p className="label font-bold">{`${label}`}</p>
        <p>{`Latency: ${payload[0].value} ms`}</p>
      </div>
    );
  }
  return null;
};

export const RedisLatencyChart = ({ data }: RedisLatencyChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Command Latency (ms)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} ms`}
            />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="latencyMs"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Latency"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};