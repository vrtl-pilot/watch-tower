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
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface MigrationItem {
  id: number;
  fundName: string;
  date: Date;
  env: string;
}

const Migration = () => {
  const [migrations, setMigrations] = useState<MigrationItem[]>([
    { id: 1, fundName: "Sample Fund A", date: new Date(), env: "prod" },
    { id: 2, fundName: "Sample Fund B", date: new Date(), env: "prod" },
  ]);
  const [newFundName, setNewFundName] = useState("");
  const [newDate, setNewDate] = useState<Date | undefined>(new Date());

  const handleAddMigration = () => {
    if (newFundName && newDate) {
      const newItem: MigrationItem = {
        id: Date.now(),
        fundName: newFundName,
        date: newDate,
        env: "prod",
      };
      setMigrations([...migrations, newItem]);
      setNewFundName("");
      setNewDate(new Date());
    }
  };

  const handleRemoveMigration = (id: number) => {
    setMigrations(migrations.filter((item) => item.id !== id));
  };

  return (
    <div className="p-8 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Migration</h2>
        <Select defaultValue="prod">
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

      <Card>
        <CardHeader>
          <CardTitle>Add New Migration</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="grid flex-grow min-w-[200px] items-center gap-1.5">
            <Label htmlFor="fundName">Fund name</Label>
            <Input
              id="fundName"
              value={newFundName}
              onChange={(e) => setNewFundName(e.target.value)}
            />
          </div>
          <div className="grid flex-grow min-w-[200px] items-center gap-1.5">
            <Label htmlFor="date">Date</Label>
            <DatePicker date={newDate} setDate={setNewDate} />
          </div>
          <Button onClick={handleAddMigration}>Add</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Migration Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migrations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-2 border rounded-md"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Fund name
                      </Label>
                      <p>{item.fundName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Date
                      </Label>
                      <p>{item.date.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Environment
                      </Label>
                      <p className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {item.env}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMigration(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/50">
              <pre className="text-sm">
                <code>
                  {[
                    "[INFO] Starting migration process...",
                    "[INFO] Connecting to production database...",
                    "[SUCCESS] Connection established.",
                    "[INFO] Processing migration for Sample Fund A...",
                    "[WARN] Data mismatch found for user #123. Skipping.",
                    "[SUCCESS] Migration for Sample Fund A completed.",
                    "[INFO] Processing migration for Sample Fund B...",
                    "[SUCCESS] Migration for Sample Fund B completed.",
                    "[INFO] Migration process finished.",
                  ].join("\n")}
                </code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Migration;