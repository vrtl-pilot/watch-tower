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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FundSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFund: (fundName: string) => void;
  initialSearchTerm: string; // New prop for initial search term
}

export const FundSearchDialog = ({ open, onOpenChange, onSelectFund, initialSearchTerm }: FundSearchDialogProps) => {
  const [funds, setFunds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const fetchFunds = async (query: string) => {
    setIsLoading(true);
    try {
      // Pass the search query to the API
      const response = await fetch(`/api/funds?query=${encodeURIComponent(query)}`);
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

  useEffect(() => {
    if (open) {
      // When dialog opens, set local search term and fetch data
      setSearchTerm(initialSearchTerm);
      fetchFunds(initialSearchTerm);
    }
  }, [open, initialSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFunds(searchTerm);
  };

  const handleSelect = (fundName: string) => {
    onSelectFund(fundName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select or Search Fund</DialogTitle>
          <DialogDescription>
            Enter a fund name or partial name to search the database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Search fund name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </form>

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
                <p className="text-sm text-muted-foreground">No funds found matching "{searchTerm}".</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};