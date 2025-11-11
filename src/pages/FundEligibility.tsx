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
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, X, Loader2 } from "lucide-react";
import { FundSearchDialog } from "@/components/FundSearchDialog";
import { showSuccess, showError } from "@/utils/toast";
import { EligibilityDisplay } from "@/components/EligibilityDisplay";
import { ENVIRONMENTS, DEFAULT_ENVIRONMENT } from "@/lib/constants";

// New TypeScript interfaces matching the updated C# models
interface FundEligibilityResult {
  fundName: string;
  status: 'Eligible' | 'Ineligible' | 'Pending';
  criteria: {
    name: string;
    met: boolean;
    reason?: string;
  }[];
  frequency: string;
  clientFundName: string;
  company: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  subFundIds: string;
}

interface FundEligibilityResponse {
  // Key: Company Name, Value: FundEligibilityResult
  companyResults: Record<string, FundEligibilityResult>;
}

const FundEligibility = () => {
  const [selectedFundName, setSelectedFundName] = useState("");
  const [isFundSearchOpen, setIsFundSearchOpen] = useState(false);
  const [eligibilityResponse, setEligibilityResponse] = useState<FundEligibilityResponse | null>(null);
  const [environment, setEnvironment] = useState(DEFAULT_ENVIRONMENT.toLowerCase());
  const [isLoading, setIsLoading] = useState(false);
  const [primaryFunds, setPrimaryFunds] = useState(false);
  const [includeFof, setIncludeFof] = useState(false);
  const [useDate, setUseDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSelectFund = (fundName: string) => {
    setSelectedFundName(fundName);
    setIsFundSearchOpen(false);
    setEligibilityResponse(null); // Clear previous results when a new fund is selected
    showSuccess(`Fund selected: ${fundName}`);
  };

  const handleCheckEligibility = async () => {
    if (!selectedFundName) return;

    setIsLoading(true);
    setEligibilityResponse(null);

    try {
      const requestBody = {
        fundName: selectedFundName,
        environment,
        primaryFunds,
        includeFof,
        date: useDate ? selectedDate : null,
      };

      const response = await fetch('/api/fundeligibility/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to check eligibility.');
      }

      const result: FundEligibilityResponse = await response.json();
      setEligibilityResponse(result);
      
      const companyCount = Object.keys(result.companyResults).length;
      showSuccess(`Eligibility check completed for ${selectedFundName} across ${companyCount} company(s).`);
    } catch (error) {
      console.error("Error checking eligibility:", error);
      showError("An error occurred while checking eligibility.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFundName("");
    setEligibilityResponse(null);
    showSuccess("Selection cleared.");
  };

  const companyResultsArray = eligibilityResponse ? Object.entries(eligibilityResponse.companyResults) : [];

  return (
    <>
      <div className="p-8 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Fund Eligibility</h2>
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

        {/* Fund Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Select Fund for Eligibility Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
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
            </div>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Checkbox
                    id="primaryFunds"
                    checked={primaryFunds}
                    onCheckedChange={(checked) => setPrimaryFunds(checked === true)}
                  />
                  <Label htmlFor="primaryFunds">Primary funds</Label>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Checkbox
                    id="includeFof"
                    checked={includeFof}
                    onCheckedChange={(checked) => setIncludeFof(checked === true)}
                  />
                  <Label htmlFor="includeFof">Include Fof</Label>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Checkbox
                    id="useDate"
                    checked={useDate}
                    onCheckedChange={(checked) => setUseDate(checked === true)}
                  />
                  <Label htmlFor="useDate">Date</Label>
                  {useDate && <DatePicker date={selectedDate} setDate={setSelectedDate} className="flex-shrink-0 min-w-[200px]" />}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button onClick={handleCheckEligibility} disabled={!selectedFundName || isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Check Eligibility
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={!selectedFundName && !eligibilityResponse}>
                  <X className="h-4 w-4 mr-2" /> Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Results/Reference Area */}
        <Card>
          <CardHeader>
            <CardTitle>
              {eligibilityResponse ? `Eligibility Results for ${selectedFundName}` : "Eligibility Criteria Reference"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : companyResultsArray.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {companyResultsArray.map(([companyName, result]) => (
                  <EligibilityDisplay
                    key={companyName}
                    result={result}
                  />
                ))}
              </div>
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
        environment={environment}
      />
    </>
  );
};

export default FundEligibility;