import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsPerformance = () => {
  return (
    <div className="p-8 pt-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Analytics: Performance</h2>
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed performance metrics will be displayed here. (Feature coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPerformance;