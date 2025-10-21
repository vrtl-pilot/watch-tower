import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";

interface FundSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFund: (fundName: string) => void;
}

export const FundSearchDialog = ({ open, onOpenChange, onSelectFund }: FundSearchDialogProps) => {
  const [funds, setFunds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchFunds = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/funds");
          if (!response.ok) {
            throw new Error("Failed to fetch funds.");
          }
          const data = await response.json();
          setFunds(data);
        } catch (error) {
          console.error("Error fetching funds:", error);
          showError("Could not load funds. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchFunds();
    }
  }, [open]);

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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))
            ) : funds.length > 0 ? (
              funds.map((fund) => (
                <div key={fund} className="flex items-center justify-between p-2 border rounded-md">
                  <p className="text-sm font-medium">{fund}</p>
                  <Button variant="outline" size="sm" onClick={() => handleSelect(fund)}>
                    Select
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-sm text-muted-foreground">No funds found.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};