import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyButton } from "./CopyButton";

interface LogViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logMessages: string[];
}

export const LogViewerDialog = ({ open, onOpenChange, logMessages }: LogViewerDialogProps) => {
  const fullLogContent = logMessages.join("\n");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Full Migration Log</DialogTitle>
          <DialogDescription>
            Real-time log output from the WatchTower backend services.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end mb-2">
          <CopyButton content={fullLogContent} label="Log Content" className="h-8 w-8" />
        </div>

        <ScrollArea className="flex-1 w-full rounded-md border p-4 bg-muted/50 min-h-0">
          <pre className="text-sm font-mono whitespace-pre-wrap break-words">
            <code>
              {fullLogContent}
            </code>
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};