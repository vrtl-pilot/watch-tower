import { RequestChart } from "@/components/RequestChart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight } from "lucide-react";

const Requests = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
        <div className="flex items-center space-x-2">
          <Select defaultValue="last_60_mins">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_15_mins">Last 15 Mins</SelectItem>
              <SelectItem value="last_60_mins">Last 60 Mins</SelectItem>
              <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <RequestChart />
      </div>
    </div>
  );
};

export default Requests;