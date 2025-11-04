import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENVIRONMENTS, DEFAULT_ENVIRONMENT } from "@/lib/constants";
import { RedisKeyTable } from "@/components/RedisKeyTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Placeholder component for Request Data Table
const RequestDataTable = ({ environment }: { environment: string }) => {
  const sampleRequests = [
    { id: 101, endpoint: "/api/v1/invalid", reason: "400 Bad Request", timestamp: "2024-01-01 10:00:00" },
    { id: 102, endpoint: "/api/v1/legacy", reason: "Deprecated Endpoint", timestamp: "2024-01-01 10:05:00" },
    { id: 103, endpoint: "/api/v1/error", reason: "500 Internal Error", timestamp: "2024-01-01 10:10:00" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invalid Request Data ({environment})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell className="font-mono text-xs">{request.endpoint}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{request.timestamp}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sampleRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No invalid requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


const ClearInvalidRequests = () => {
  const [environment, setEnvironment] = useState(DEFAULT_ENVIRONMENT.toLowerCase());

  return (
    <div className="p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clear Invalid Requests</h2>
        <Select value={environment} onValueChange={(value) => setEnvironment(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            {ENVIRONMENTS.map(env => (
              <SelectItem key={env} value={env.toLowerCase()}>{env}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-6">
        {/* 1. Redis Data Table */}
        <RedisKeyTable environment={environment} />
        
        {/* 2. Request Data Table (Placeholder) */}
        <RequestDataTable environment={environment} />
      </div>
    </div>
  );
};

export default ClearInvalidRequests;