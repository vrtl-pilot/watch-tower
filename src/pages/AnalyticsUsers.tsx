import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsUsers = () => {
  return (
    <div className="p-8 pt-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Analytics: User Demographics</h2>
      <Card>
        <CardHeader>
          <CardTitle>User Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            User demographics and usage statistics will be displayed here. (Feature coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsUsers;