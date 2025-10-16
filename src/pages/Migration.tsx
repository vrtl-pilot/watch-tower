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
import { X, Trash2, Pencil, Check, Ban, Search } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showSuccess } from "@/utils/toast";
import { FundSearchDialog } from "@/components/FundSearchDialog";

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | "bulk" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{ fundName: string; date?: Date; env: string }>({ fundName: "", env: "" });
  const [isFundSearchOpen, setIsFundSearchOpen] = useState(false);

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

  const openConfirmationDialog = (id: number | "bulk") => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    let deletedCount = 0;
    if (itemToDelete === "bulk") {
      deletedCount = selectedItems.length;
      setMigrations(migrations.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } else if (itemToDelete !== null) {
      deletedCount = 1;
      setMigrations(migrations.filter((item) => item.id !== itemToDelete));
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    if (deletedCount > 0) {
      showSuccess(`Successfully deleted ${deletedCount} migration(s).`);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedItems(migrations.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleEdit = (item: MigrationItem) => {
    setEditingId(item.id);
    setEditFormData({ fundName: item.fundName, date: item.date, env: item.env });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: number) => {
    if (!editFormData.fundName || !editFormData.date) return;
    setMigrations(
      migrations.map((item) =>
        item.id === id
          ? { ...item, fundName: editFormData.fundName, date: editFormData.date!, env: editFormData.env }
          : item
      )
    );
    setEditingId(null);
    showSuccess("Migration item updated successfully.");
  };

  const handleEnqueue = () => {
    showSuccess(`${migrations.length} migration(s) have been enqueued.`);
  };

  const handleConfirmCancel = () => {
    setMigrations([]);
    setSelectedItems([]);
    setIsCancelDialogOpen(false);
    showSuccess("Migration queue has been cleared.");
  };

  const handleSelectFund = (fundName: string) => {
    setNewFundName(fundName);
    setIsFundSearchOpen(false);
  };

  return (
    <>
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
              <div className="relative flex items-center">
                <Input
                  id="fundName"
                  value={newFundName}
                  onChange={(e) => setNewFundName(e.target.value)}
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
            <div className="grid flex-grow min-w-[200px] items-center gap-1.5">
              <Label htmlFor="date">Date</Label>
              <DatePicker date={newDate} setDate={setNewDate} />
            </div>
            <Button onClick={handleAddMigration}>Add</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Checkbox
                  id="selectAll"
                  checked={
                    migrations.length > 0 && selectedItems.length === migrations.length
                      ? true
                      : selectedItems.length > 0
                      ? 'indeterminate'
                      : false
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all migrations"
                />
                <CardTitle>Migration Queue</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {selectedItems.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => openConfirmationDialog("bulk")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedItems.length})
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(true)}
                  disabled={migrations.length === 0}
                >
                  Cancel
                </Button>
                <Button onClick={handleEnqueue} disabled={migrations.length === 0}>
                  Enqueue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {migrations.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-2 border rounded-md"
                  >
                    <Checkbox
                      className="mt-1"
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelect(item.id)}
                      aria-label={`Select migration for ${item.fundName}`}
                      disabled={editingId !== null}
                    />
                    {editingId === item.id ? (
                      <>
                        <div className="flex-1 flex flex-wrap items-center gap-4">
                          <Input
                            className="w-auto flex-grow"
                            value={editFormData.fundName}
                            onChange={(e) => setEditFormData({ ...editFormData, fundName: e.target.value })}
                          />
                          <DatePicker
                            date={editFormData.date}
                            setDate={(date) => setEditFormData({ ...editFormData, date })}
                          />
                          <Select
                            value={editFormData.env}
                            onValueChange={(value) => setEditFormData({ ...editFormData, env: value })}
                          >
                            <SelectTrigger className="w-auto flex-grow">
                              <SelectValue placeholder="Environment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prod">Production</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="dev">Development</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => handleSaveEdit(item.id)}>
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <Label className="text-xs text-muted-foreground">Fund name</Label>
                            <p>{item.fundName}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Date</Label>
                            <p>{item.date.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Environment</Label>
                            <p>{item.env}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openConfirmationDialog(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected migration(s) from the queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear the entire migration queue. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, clear queue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FundSearchDialog
        open={isFundSearchOpen}
        onOpenChange={setIsFundSearchOpen}
        onSelectFund={handleSelectFund}
      />
    </>
  );
};

export default Migration;