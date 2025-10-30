import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MigrationDecoder = () => {
  return (
    <div className="p-8 pt-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Migration Decoder</h2>
      <Card>
        <CardHeader>
          <CardTitle>Decode Migration Payloads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will allow decoding and inspecting migration payloads. (Feature coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationDecoder;