import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const queueData = [
  { name: "Large Worker Queue", count: 0 },
  { name: "Normal Worker Queue", count: 147 },
];

export const WorkerQueueInfo = () => {
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
        <div className="space-y-4">
          {queueData.map((queue) => (
            <div
              key={queue.name}
              className="flex items-center justify-between rounded-lg border bg-card text-card-foreground shadow-sm p-4 border-l-4 border-primary"
            >
              <div>
                <p className="text-sm font-medium">{queue.name}</p>
                <p className="text-2xl font-bold">{queue.count}</p>
              </div>
              <Button variant="destructive">Clear</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};