import {
  Card,
  CardContent,
  CardDescription,
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

interface EndpointData {
  endpoint: string;
  value: string;
}

interface EndpointBarChartProps {
  title: string;
  description: string;
  data: EndpointData[];
}

const parseValue = (value: string): number => {
  return parseInt(value.replace(/,/g, "").split(" ")[0], 10);
};

export const EndpointBarChart = ({ title, description, data }: EndpointBarChartProps) => {
  const chartData = data
    .map((item) => ({
      name: item.endpoint,
      requests: parseValue(item.value),
      originalValue: item.value,
    }))
    .sort((a, b) => a.requests - b.requests);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
                      <p>{`${payload[0].payload.originalValue}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]}>
              <LabelList
                dataKey="originalValue"
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