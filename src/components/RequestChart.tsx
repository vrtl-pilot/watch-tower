import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const chartData = [
  { name: "5:00 PM", total: 230, errors: 3, success: 227 },
  { name: "5:05 PM", total: 280, errors: 5, success: 275 },
  { name: "5:10 PM", total: 350, errors: 8, success: 342 },
  { name: "5:15 PM", total: 320, errors: 4, success: 316 },
  { name: "5:20 PM", total: 410, errors: 12, success: 398 },
  { name: "5:25 PM", total: 380, errors: 10, success: 370 },
  { name: "5:30 PM", total: 450, errors: 15, success: 435 },
];

export const RequestChart = () => {
  return (
    <Card className="col-span-1 md:col-span-4">
      <CardHeader>
        <CardTitle>Request Metrics Over Time</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="name"
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
              tickFormatter={(value) => `${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Total Requests"
            />
            <Line
              type="monotone"
              dataKey="success"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              name="Successful Requests"
            />
            <Line
              type="monotone"
              dataKey="errors"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={false}
              name="Errors"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};