import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ServerItem {
  server: string;
  service: string;
  serverStatus: "Running" | "Stopped" | string;
  serviceStatus: "Running" | "Stopped" | string;
}

interface ServerStatusTableProps {
  data: ServerItem[];
}

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    className={cn(
      "text-white",
      status === "Running"
        ? "bg-green-600 hover:bg-green-600/80"
        : "bg-red-600 hover:bg-red-600/80"
    )}
  >
    {status}
  </Badge>
);

export const ServerStatusTable = ({ data }: ServerStatusTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Server</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Server Status</TableHead>
          <TableHead className="text-right">Service Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={`${item.server}-${index}`}>
            <TableCell className="font-medium">{item.server}</TableCell>
            <TableCell>{item.service}</TableCell>
            <TableCell>
              <StatusBadge status={item.serverStatus} />
            </TableCell>
            <TableCell className="text-right">
              <StatusBadge status={item.serviceStatus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};