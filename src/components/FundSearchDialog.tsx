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
import { Input } from "./ui/input";
import { Search, Loader2 } from "lucide-react";

interface FundSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFund: (fundName: string) => void;
  environment: string; // Added environment prop
}

const fetchFunds = async (pattern: string, environment: string): Promise<string[]> => {
  const query = pattern ? `?searchPattern=${encodeURIComponent(pattern)}&environment=${encodeURIComponent(environment)}` : `?environment=${encodeURIComponent(environment)}`;
  const response = await fetch(`/api/funds${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch funds.");
  }
  return response.json();
};

export const FundSearchDialog = ({ open, onOpenChange, onSelectFund, environment }: FundSearchDialogProps) => {
  const [funds, setFunds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPattern, setCurrentPattern] = useState("");

  const handleSearch = async (pattern: string) => {
    if (!pattern.trim()) {
      setFunds([]);
      showError("Please enter a search term.");
      return;
    }
    
    setIsLoading(true);
    setCurrentPattern(pattern);
    try {
      const data = await fetchFunds(pattern, environment);
      setFunds(data);
    } catch (error) {
      console.error("Error fetching funds:", error);
      showError("Could not load funds. Please try again.");
      setFunds([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load when dialog opens (with current search query if available)
  useEffect(() => {
    if (open) {
      // If the dialog opens, perform an initial search based on the current query
      // If searchQuery is empty, we rely on the user to click search or enter text.
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setFunds([]);
      }
    }
  }, [open, environment]); // Added environment to dependency array

  const handleSelect = (fundName: string) => {
    onSelectFund(fundName);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search and Select Fund</DialogTitle>
          <DialogDescription>
            Enter a fund name or pattern to search the database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="Enter fund name or pattern (e.g., Global*)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
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
            ) : currentPattern.trim() ? (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-sm text-muted-foreground">No funds found matching "{currentPattern}".</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-sm text-muted-foreground">Enter a search pattern and click search.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};