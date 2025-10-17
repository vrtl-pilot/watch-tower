import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatJson = () => {
  return (
    <div className="p-8 pt-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Stat JSON Viewer</h2>
      <Card>
        <CardHeader>
          <CardTitle>View Raw Statistics JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display raw JSON data for various application statistics. (Feature coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatJson;