import { useState } from "react";
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
import { TooltipProps } from "recharts";

const chartData = [
  { name: "5:00 PM", total: 230, errors: 3, success: 227 },
  { name: "5:05 PM", total: 280, errors: 5, success: 275 },
  { name: "5:10 PM", total: 350, errors: 8, success: 342 },
  { name: "5:15 PM", total: 320, errors: 4, success: 316 },
  { name: "5:20 PM", total: 410, errors: 12, success: 398 },
  { name: "5:25 PM", total: 380, errors: 10, success: 370 },
  { name: "5:30 PM", total: 450, errors: 15, success: 435 },
];

type VisibilityState = {
  total: boolean;
  success: boolean;
  errors: boolean;
};

export const RequestChart = () => {
  const [visibility, setVisibility] = useState<VisibilityState>({
    total: true,
    success: true,
    errors: true,
  });

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    setVisibility((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const yMax = Math.ceil(
    Math.max(
      ...chartData.flatMap((d) => {
        const values = [];
        if (visibility.total) values.push(d.total);
        if (visibility.success) values.push(d.success);
        if (visibility.errors) values.push(d.errors);
        if (values.length === 0) return [0];
        return values;
      })
    ) * 1.1
  );

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border border-border rounded-md shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          {payload.map((pld) =>
            visibility[pld.dataKey as keyof VisibilityState] ? (
              <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.name}: ${pld.value}`}
              </p>
            ) : null
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 md-col-span-4">
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
              domain={[0, yMax > 5 ? yMax : 'auto']}
            />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Tooltip content={<CustomTooltip />} />
            <Legend onClick={handleLegendClick} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Total Requests"
              hide={!visibility.total}
            />
            <Line
              type="monotone"
              dataKey="success"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              name="Successful Requests"
              hide={!visibility.success}
            />
            <Line
              type="monotone"
              dataKey="errors"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={false}
              name="Errors"
              hide={!visibility.errors}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};