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
  name: string;
  server: string;
  service: string;
  status: "Running" | "Stopped" | string;
}

interface ServerStatusTableProps {
  data: ServerItem[];
}

export const ServerStatusTable = ({ data }: ServerStatusTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Server</TableHead>
          <TableHead>Service</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.server}</TableCell>
            <TableCell>{item.service}</TableCell>
            <TableCell className="text-right">
              <Badge
                className={cn(
                  "text-white",
                  item.status === "Running"
                    ? "bg-green-600 hover:bg-green-600/80"
                    : "bg-red-600 hover:bg-red-600/80"
                )}
              >
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};