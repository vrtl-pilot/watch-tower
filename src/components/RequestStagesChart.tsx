import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

const stagesData = [
  { name: "Calc. Completed", count: 1 },
  { name: "Graph Started", count: 6 },
  { name: "Req. Completed", count: 4213 },
  { name: "Req. Failed", count: 140 },
  { name: "Worker Recv.", count: 48 },
  { name: "Duplicate Req. in Queue", count: 1 },
];

export const RequestStagesChart = () => {
  const chartData = stagesData.sort((a, b) => a.count - b.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Total Request Stages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={150}
              tick={{ fontSize: 12 }}
              className="truncate"
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 bg-background border border-border rounded-md shadow-lg">
                      <p className="font-bold">{`${payload[0].payload.name}`}</p>
                      <p>{`${payload[0].payload.count}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]}>
              <LabelList
                dataKey="count"
                position="right"
                offset={10}
                style={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};