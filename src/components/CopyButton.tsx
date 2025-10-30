import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CopyButtonProps {
  content: string;
  label: string;
  className?: string;
}

export const CopyButton = ({ content, label, className }: CopyButtonProps) => {
  const handleCopy = async () => {
    if (!content.trim()) {
      showError(`Cannot copy empty ${label}.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      showSuccess(`${label} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showError(`Failed to copy ${label}.`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleCopy}
      title={`Copy ${label}`}
      disabled={!content.trim()}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
};