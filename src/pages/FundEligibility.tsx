import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { FundSearchDialog } from "@/components/FundSearchDialog";
import { showSuccess } from "@/utils/toast";

const FundEligibility = () => {
  const [selectedFundName, setSelectedFundName] = useState("");
  const [isFundSearchOpen, setIsFundSearchOpen] = useState(false);

  const handleSelectFund = (fundName: string) => {
    setSelectedFundName(fundName);
    setIsFundSearchOpen(false);
    showSuccess(`Fund selected: ${fundName}`);
  };

  return (
    <>
      <div className="p-8 pt-6 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Fund Eligibility</h2>

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
            <Button disabled={!selectedFundName}>Check Eligibility</Button>
          </CardContent>
        </Card>

        {/* Image Reference Area */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-dashed rounded-lg bg-muted/30 flex items-center justify-center h-64">
              <p className="text-muted-foreground text-center">
                Placeholder for Eligibility Criteria Image Reference.
                <br />
                (Content from the provided image would be displayed here.)
              </p>
            </div>
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