import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Redis = () => {
  return (
    <div className="p-8 pt-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Redis Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Redis Cache Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will provide tools for monitoring and managing Redis instances. (Feature coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Redis;