import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stagesData = [
  { name: "Calc. Completed", count: 1 },
  { name: "Graph Started", count: 6 },
  { name: "Req. Completed", count: 4213 },
  { name: "Req. Failed", count: 140 },
  { name: "Worker Recv.", count: 48 },
  { name: "Duplicate Req. in Queue", count: 1 },
];

export const RequestStages = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Total Request Stages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stagesData.map((stage) => (
            <div
              key={stage.name}
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 border-l-4 border-primary"
            >
              <p className="text-sm font-medium truncate">{stage.name}</p>
              <p className="text-2xl font-bold">{stage.count}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};