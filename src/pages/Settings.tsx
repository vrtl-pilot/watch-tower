import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Zap, Eraser, Loader2 } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const PLACEHOLDER = "{{value}}";
const DEFAULT_TEMPLATE = `{"fundName": "${PLACEHOLDER}", "dateType": "oneDay", "env": "production"}`;

const Settings = () => {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [rawInput, setRawInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = () => {
    setIsLoading(true);
    setJsonOutput('');

    try {
      if (!rawInput.trim()) {
        showError("Input list cannot be empty.");
        return;
      }

      // 1. Parse input list: split by comma, newline, or combination, and filter empty strings
      const values = rawInput
        .split(/[\r\n,]+/)
        .map(v => v.trim())
        .filter(v => v.length > 0);

      if (values.length === 0) {
        showError("No valid values found in the input list.");
        return;
      }

      // 2. Validate template structure
      if (!template.includes(PLACEHOLDER)) {
        showError(`Template must contain the placeholder: ${PLACEHOLDER}`);
        return;
      }

      let templateObject: object;
      try {
        // Attempt to parse the template to ensure it's valid JSON structure
        templateObject = JSON.parse(template);
      } catch (e) {
        showError("Invalid JSON template format. Please ensure it is valid JSON.");
        return;
      }

      const results = values.map(value => {
        // Convert the validated template object back to a string to perform replacement
        const templateString = JSON.stringify(templateObject);
        
        // Replace the placeholder with the current value. 
        // We use a regex to replace all occurrences of the placeholder.
        const replacedString = templateString.replace(new RegExp(PLACEHOLDER, 'g'), value);
        
        try {
          return JSON.parse(replacedString);
        } catch (e) {
          console.error(`Failed to parse object after replacing value: ${value}`, e);
          return null; 
        }
      }).filter(item => item !== null);

      setJsonOutput(JSON.stringify(results, null, 2));
      showSuccess(`Successfully converted ${results.length} item(s) to JSON array.`);

    } catch (error) {
      console.error("Conversion error:", error);
      showError("An unexpected error occurred during conversion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setRawInput('');
    setJsonOutput('');
    showSuccess("Input and output cleared.");
  };

  return (
    <div className="p-8 pt-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Batch JSON Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Template Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">JSON Template (Use <code className={cn("bg-muted p-1 rounded text-primary font-mono", isLoading && "opacity-50")}>{PLACEHOLDER}</code> as placeholder)</label>
            <Textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="font-mono text-xs resize-none h-32"
              placeholder={DEFAULT_TEMPLATE}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Define the structure of a single JSON object. The placeholder will be replaced by each value from the input list.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 h-[40vh]">
            {/* Raw Input List */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-2">Input List (Comma or Newline Separated)</label>
              <Textarea
                placeholder="e.g., FundA, FundB, FundC"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="flex-1 font-mono text-xs resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Middle Controls */}
            <div className="flex flex-row lg:flex-col items-center justify-center gap-4 p-4 lg:p-0">
              <Button onClick={handleConvert} size="icon" title="Convert to JSON" disabled={isLoading || !rawInput.trim()}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              </Button>
              <Button onClick={handleClear} variant="outline" size="icon" title="Clear Input/Output" disabled={isLoading}>
                <Eraser className="h-5 w-5" />
              </Button>
            </div>

            {/* JSON Output */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-2">Generated JSON Array</label>
              <Textarea
                readOnly
                value={jsonOutput}
                className="flex-1 font-mono text-xs resize-none bg-muted/50"
                placeholder="Generated JSON array will appear here..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;