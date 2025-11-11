import { CheckCircle, XCircle, Clock, Calendar, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Renamed from EligibilityResult to FundEligibilityResult to match backend model
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

interface EligibilityDisplayProps {
  result: FundEligibilityResult;
}

const statusMap = {
  Eligible: { icon: CheckCircle, color: "bg-green-600 hover:bg-green-600/80", text: "text-green-500" },
  Ineligible: { icon: XCircle, color: "bg-red-600 hover:bg-red-600/80", text: "text-red-500" },
  Pending: { icon: Clock, color: "bg-yellow-600 hover:bg-yellow-600/80", text: "text-yellow-500" },
};

export const EligibilityDisplay = ({ result }: EligibilityDisplayProps) => {
  const { icon: StatusIcon, color: statusColor } = statusMap[result.status];

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-background">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-1 break-words pr-4">{result.company}</h3>
          <div className="text-sm text-muted-foreground">
            <span>{result.frequency}</span>
            {result.clientFundName && <span> • {result.clientFundName}</span>}
          </div>
          {(result.startDate || result.endDate || result.subFundIds) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {result.startDate && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  Start: {new Date(result.startDate).toLocaleDateString()}
                </Badge>
              )}
              {result.endDate && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  End: {new Date(result.endDate).toLocaleDateString()}
                </Badge>
              )}
              {result.subFundIds && result.subFundIds.split(',').map((id, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {id.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Badge
          className={cn(
            "text-white font-bold px-3 py-1.5 flex items-center gap-2 flex-shrink-0",
            statusColor
          )}
        >
          <StatusIcon className="h-4 w-4" />
          {result.status}
        </Badge>
      </div>

      <Card className="border-none shadow-none">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-base font-medium">Criteria Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-0">
          {result.criteria.map((criterion, index) => {
            const Icon = criterion.met ? CheckCircle : XCircle;
            const iconColor = criterion.met ? "text-green-500" : "text-red-500";
            const textColor = criterion.met ? "text-foreground" : "text-red-700 dark:text-red-400";

            return (
              <div key={index} className="flex flex-col justify-between border-b last:border-b-0 py-3">
                <div className="flex items-start gap-3">
                  <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconColor)} />
                  <p className={cn("font-medium text-sm flex-1", textColor)}>{criterion.name}</p>
                </div>
                {!criterion.met && criterion.reason && (
                  <p className="text-xs text-muted-foreground mt-1 ml-8">
                    Reason: {criterion.reason}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};