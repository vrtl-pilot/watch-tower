import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const fundNames = [
  "Global Tech Leaders Fund",
  "Sustainable Energy Fund",
  "Healthcare Innovation Fund",
  "Emerging Markets Growth Fund",
  "Real Estate Investment Trust",
  "Blue Chip Equity Fund",
  "Corporate Bond Fund",
  "Index 500 Tracker",
];

interface FundSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFund: (fundName: string) => void;
}

export const FundSearchDialog = ({ open, onOpenChange, onSelectFund }: FundSearchDialogProps) => {
  const handleSelect = (fundName: string) => {
    onSelectFund(fundName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Fund</DialogTitle>
          <DialogDescription>
            Choose a fund from the list below to add to the migration queue.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          <div className="space-y-2 p-1">
            {fundNames.map((fund) => (
              <div key={fund} className="flex items-center justify-between p-2 border rounded-md">
                <p className="text-sm font-medium">{fund}</p>
                <Button variant="outline" size="sm" onClick={() => handleSelect(fund)}>
                  Select
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};