import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, RefreshCw, Loader2, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/toast";
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
import { Badge } from "./ui/badge";
import { RedisKeyValueDialog } from "./RedisKeyValueDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RedisKeyEntry {
  key: string;
  type: string;
  ttlSeconds: number;
  size: number;
}

interface DeleteKeyRequest {
  key: string;
}

interface RedisKeyTableProps {
  environment: string;
}

const KEY_TYPES = ["All", "string", "hash", "list", "zset", "set", "stream"];

const formatTtl = (ttl: number) => {
  if (ttl === -1) return "Persistent";
  if (ttl === -2) return "Key not found";
  if (ttl < 60) return `${ttl}s`;
  if (ttl < 3600) return `${Math.floor(ttl / 60)}m ${ttl % 60}s`;
  return `${Math.floor(ttl / 3600)}h ${Math.floor((ttl % 3600) / 60)}m`;
};

const formatSize = (size: number) => {
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const fetchKeys = async (pattern: string, environment: string): Promise<RedisKeyEntry[]> => {
  const response = await fetch(`/api/redis/keys?environment=${environment}&pattern=${encodeURIComponent(pattern)}&limit=50`); 
  
  if (!response.ok) {
    throw new Error("Failed to fetch Redis keys.");
  }
  return response.json();
};

export const RedisKeyTable = ({ environment }: RedisKeyTableProps) => {
  const queryClient = useQueryClient();
  const [searchPattern, setSearchPattern] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [keyToView, setKeyToView] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: rawKeys, isLoading, refetch } = useQuery<RedisKeyEntry[]>({
    queryKey: ['redisKeys', environment, searchPattern],
    queryFn: () => fetchKeys(searchPattern, environment),
    refetchInterval: 10000,
  });

  const keys = useMemo(() => {
    if (!rawKeys) return [];
    if (selectedType === "All") return rawKeys;
    return rawKeys.filter(key => key.type.toLowerCase() === selectedType.toLowerCase());
  }, [rawKeys, selectedType]);

  const deleteMutation = useMutation({
    mutationFn: async ({ key }: DeleteKeyRequest) => {
      const encodedKey = encodeURIComponent(key);
      const response = await fetch(`/api/redis/key/${encodedKey}?environment=${environment}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 202) {
        throw new Error("Failed to delete key.");
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      showSuccess(data.message || `Key '${variables.key}' deleted successfully.`);
      // Invalidate and refetch the keys query to update the table
      queryClient.invalidateQueries({ queryKey: ['redisKeys', environment] });
    },
    onError: (error, variables) => {
      showError(error.message || `Failed to delete key '${variables.key}'.`);
    },
  });

  const handleDeleteClick = (key: string) => {
    setKeyToDelete(key);
    setIsDeleteDialogOpen(true);
  };
  
  const handleViewClick = (key: string) => {
    setKeyToView(key);
    setIsViewDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (keyToDelete) {
      deleteMutation.mutate({ key: keyToDelete });
    }
    setIsDeleteDialogOpen(false);
    setKeyToDelete(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Key Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-4">
            <Input
              placeholder="Search keys (e.g., user:*, cache:fund:)"
              value={searchPattern}
              onChange={(e) => setSearchPattern(e.target.value)}
              className="flex-1 min-w-[200px]"
              disabled={isLoading}
            />
            <Select value={selectedType} onValueChange={setSelectedType} disabled={isLoading}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                {KEY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </form>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground mt-2">Loading keys...</p>
                    </TableCell>
                  </TableRow>
                ) : keys && keys.length > 0 ? (
                  keys.map((keyEntry) => (
                    <TableRow key={keyEntry.key}>
                      <TableCell className="font-mono text-xs max-w-xs truncate">{keyEntry.key}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{keyEntry.type}</Badge>
                      </TableCell>
                      <TableCell>{formatTtl(keyEntry.ttlSeconds)}</TableCell>
                      <TableCell>{formatSize(keyEntry.size)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewClick(keyEntry.key)}
                            disabled={deleteMutation.isPending}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(keyEntry.key)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No keys found matching the pattern "{searchPattern}" and type "{selectedType}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Key Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete the key: 
              <code className="block mt-2 p-2 bg-muted rounded font-mono text-sm break-all">{keyToDelete}</code>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <RedisKeyValueDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        keyName={keyToView}
        environment={environment}
      />
    </>
  );
};