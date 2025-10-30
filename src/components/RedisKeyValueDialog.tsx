import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";
import { Loader2, AlertTriangle } from "lucide-react";
import { showError } from "@/utils/toast";

interface RedisKeyValueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyName: string | null;
  environment: string;
}

const fetchKeyValue = async (key: string, environment: string): Promise<string> => {
  const encodedKey = encodeURIComponent(key);
  // Now correctly passing the environment parameter
  const response = await fetch(`/api/redis/key/${encodedKey}/value?environment=${environment}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch key value.");
  }
  const text = await response.text();
  
  // Attempt to pretty print JSON if possible
  try {
    const json = JSON.parse(text);
    return JSON.stringify(json, null, 2);
  } catch {
    return text;
  }
};

export const RedisKeyValueDialog = ({ open, onOpenChange, keyName, environment }: RedisKeyValueDialogProps) => {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && keyName) {
      setIsLoading(true);
      setValue(null);
      setError(null);
      
      fetchKeyValue(keyName, environment)
        .then(setValue)
        .catch((err) => {
          console.error("Error fetching key value:", err);
          setError("Could not retrieve key value. Check API connection or key existence.");
          showError("Failed to fetch key value.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, keyName, environment]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Key Value Inspection</DialogTitle>
          <DialogDescription className="font-mono text-sm break-all">
            Key: {keyName || "N/A"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-end mb-2">
            <CopyButton content={value || ""} label="Key Value" className="h-8 w-8" />
          </div>
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-red-100 dark:bg-red-900/20 rounded-md">
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : (
              <Textarea
                readOnly
                value={value || "Key value is empty or null."}
                className="w-full h-full font-mono text-xs resize-none"
                placeholder="Loading key value..."
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};