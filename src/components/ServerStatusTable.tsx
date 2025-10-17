import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Play, Power, RefreshCw, StopCircle } from "lucide-react";

interface ServerItem {
  id: string;
  serverName: string;
  service: string;
  serverStatus: "Running" | "Stopped" | "Degraded";
  serviceStatus: "Running" | "Stopped" | "Down" | "Degraded";
}

type ActionType = "startServer" | "stopServer" | "restartServer" | "startService" | "stopService" | "restartService";

interface ServerStatusTableProps {
  data: ServerItem[];
  onAction: (id: string, actionType: ActionType, serverName: string, serviceName: string) => void;
}

const StatusBadge = ({ status }: { status: "Running" | "Stopped" | "Down" | "Degraded" }) => (
  <Badge
    className={cn(
      "text-white",
      status === "Running" && "bg-green-600 hover:bg-green-600/80",
      status === "Stopped" && "bg-red-600 hover:bg-red-600/80",
      status === "Down" && "bg-yellow-500 hover:bg-yellow-500/80",
      status === "Degraded" && "bg-orange-500 hover:bg-orange-500/80" // New color for Degraded
    )}
  >
    {status}
  </Badge>
);

export const ServerStatusTable = ({ data, onAction }: ServerStatusTableProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ServerItem | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const handleActionClick = (item: ServerItem, type: ActionType) => {
    setSelectedItem(item);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedItem || !actionType) return;

    // Pass necessary details to the parent component to handle the API call and toast lifecycle
    onAction(selectedItem.id, actionType, selectedItem.serverName, selectedItem.service);
    
    setDialogOpen(false);
  };

  const getDialogContent = () => {
    if (!selectedItem || !actionType) return { title: "", description: "" };
    const contentMap: Record<ActionType, { title: string; description: string }> = {
      startServer: { title: "Start Server?", description: `Are you sure you want to start the server ${selectedItem.serverName}?` },
      stopServer: { title: "Shutdown Server?", description: `This will shut down the server ${selectedItem.serverName} and stop its services. Are you sure?` },
      restartServer: { title: "Restart Server?", description: `Are you sure you want to restart the server ${selectedItem.serverName}?` },
      startService: { title: "Start Service?", description: `Are you sure you want to start the ${selectedItem.service} service?` },
      stopService: { title: "Stop Service?", description: `Are you sure you want to stop the ${selectedItem.service} service?` },
      restartService: { title: "Restart Service?", description: `Are you sure you want to restart the ${selectedItem.service} service?` },
    };
    return contentMap[actionType];
  };

  const { title, description } = getDialogContent();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Server</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Server Status</TableHead>
            <TableHead>Service Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.serverName}</TableCell>
              <TableCell>{item.service}</TableCell>
              <TableCell><StatusBadge status={item.serverStatus} /></TableCell>
              <TableCell><StatusBadge status={item.serviceStatus} /></TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {/* Server Actions */}
                  <div className="flex items-center gap-1">
                    {item.serverStatus === "Stopped" ? (
                      <Tooltip>
                        <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleActionClick(item, "startServer")}><Play className="h-4 w-4 text-green-500" /></Button></TooltipTrigger>
                        <TooltipContent><p>Start Server</p></TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleActionClick(item, "stopServer")}><Power className="h-4 w-4 text-red-500" /></Button></TooltipTrigger>
                          <TooltipContent><p>Shutdown Server</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleActionClick(item, "restartServer")}><RefreshCw className="h-4 w-4 text-blue-500" /></Button></TooltipTrigger>
                          <TooltipContent><p>Restart Server</p></TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>

                  {/* Service Actions */}
                  {(item.serverStatus === "Running" || item.serverStatus === "Degraded") && (
                    <>
                      <Separator orientation="vertical" className="h-6 mx-2" />
                      <div className="flex items-center gap-1">
                        {item.serviceStatus === "Stopped" ? (
                          <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleActionClick(item, "startService")}><Play className="h-4 w-4 text-green-500" /></Button></TooltipTrigger>
                            <TooltipContent><p>Start Service</p></TooltipContent>
                          </Tooltip>
                        ) : (item.serviceStatus === "Down" || item.serviceStatus === "Degraded") ? (
                          <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleActionClick(item, "restartService")}><RefreshCw className="h-4 w-4 text-blue-500" /></Button></TooltipTrigger>
                            <TooltipContent><p>Restart Service</p></TooltipContent>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleActionClick(item, "stopService")}><StopCircle className="h-4 w-4 text-red-500" /></Button></TooltipTrigger>
                              <TooltipContent><p>Stop Service</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleActionClick(item, "restartService")}><RefreshCw className="h-4 w-4 text-blue-500" /></Button></TooltipTrigger>
                              <TooltipContent><p>Restart Service</p></TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};