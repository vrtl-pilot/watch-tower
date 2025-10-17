import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Loader2 } from "lucide-react";
import { FundSearchDialog } from "@/components/FundSearchDialog";
import { showSuccess, showError } from "@/utils/toast";
import { EligibilityDisplay } from "@/components/EligibilityDisplay";

interface EligibilityResult {
  fundName: string;
  status: 'Eligible' | 'Ineligible' | 'Pending';
  criteria: {
    name: string;
    met: boolean;
    reason?: string;
  }[];
}

const FundEligibility = () => {
  const [selectedFundName, setSelectedFundName] = useState("");
  const [isFundSearchOpen, setIsFundSearchOpen] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [environment, setEnvironment] = useState("prod");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFund = (fundName: string) => {
    setSelectedFundName(fundName);
    setIsFundSearchOpen(false);
    setEligibilityResult(null); // Clear previous results when a new fund is selected
    showSuccess(`Fund selected: ${fundName}`);
  };

  const handleCheckEligibility = async () => {
    if (!selectedFundName) return;

    setIsLoading(true);
    setEligibilityResult(null);

    try {
      const response = await fetch('/api/fundeligibility/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fundName: selectedFundName, environment }),
      });

      if (!response.ok) {
        throw new Error('Failed to check eligibility.');
      }

      const result: EligibilityResult = await response.json();
      setEligibilityResult(result);
      showSuccess(`Eligibility check completed for ${result.fundName}. Status: ${result.status}`);
    } catch (error) {
      console.error("Error checking eligibility:", error);
      showError("An error occurred while checking eligibility.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFundName("");
    setEligibilityResult(null);
    showSuccess("Selection cleared.");
  };

  return (
    <>
      <div className="p-8 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Fund Eligibility</h2>
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prod">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="dev">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fund Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Select Fund for Eligibility Check</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="grid flex-grow min-w-[250px] items-center gap-1.5">
              <Label htmlFor="fundName">Fund Name</Label>
              <div className="relative flex items-center">
                <Input
                  id="fundName"
                  value={selectedFundName}
                  onChange={(e) => setSelectedFundName(e.target.value)}
                  placeholder="Search or select a fund"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-7 w-7"
                  onClick={() => setIsFundSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search funds</span>
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCheckEligibility} disabled={!selectedFundName || isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Eligibility
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={!selectedFundName && !eligibilityResult}>
                <X className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Results/Reference Area */}
        <Card>
          <CardHeader>
            <CardTitle>
              {eligibilityResult ? `Eligibility Results for ${eligibilityResult.fundName}` : "Eligibility Criteria Reference"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : eligibilityResult ? (
              <EligibilityDisplay result={eligibilityResult} />
            ) : (
              <div className="p-4 border border-dashed rounded-lg bg-muted/30 flex items-center justify-center h-64">
                <p className="text-muted-foreground text-center">
                  Select a fund and click "Check Eligibility" to view results.
                  <br />
                  (Placeholder for Eligibility Criteria Image Reference.)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FundSearchDialog
        open={isFundSearchOpen}
        onOpenChange={setIsFundSearchOpen}
        onSelectFund={handleSelectFund}
      />
    </>
  );
};

export default FundEligibility;