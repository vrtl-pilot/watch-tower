import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Eraser, Zap, Loader2 } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { CopyButton } from '@/components/CopyButton';
import { useJsonTemplate, PLACEHOLDER } from '@/hooks/use-json-template';
import { cn } from '@/lib/utils';

const JsonFormatter = () => {
  const { template: savedTemplate } = useJsonTemplate();
  
  const [rawInput, setRawInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState(savedTemplate);
  const [isLoading, setIsLoading] = useState(false);

  // Sync current template with saved template whenever it changes in the store
  useEffect(() => {
    setCurrentTemplate(savedTemplate);
  }, [savedTemplate]);

  const handleBatchConvert = () => {
    setIsLoading(true);
    setFormattedJson('');

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
      if (!currentTemplate.includes(PLACEHOLDER)) {
        showError(`Template must contain the placeholder: ${PLACEHOLDER}`);
        return;
      }

      let templateObject: object;
      try {
        // Attempt to parse the template to ensure it's valid JSON structure
        templateObject = JSON.parse(currentTemplate);
      } catch (e) {
        showError("Invalid JSON template format. Please check your template in Settings.");
        return;
      }

      const results = values.map(value => {
        // Convert the validated template object back to a string to perform replacement
        const templateString = JSON.stringify(templateObject);
        
        // Replace the placeholder with the current value. 
        const replacedString = templateString.replace(new RegExp(PLACEHOLDER, 'g'), value);
        
        try {
          return JSON.parse(replacedString);
        } catch (e) {
          console.error(`Failed to parse object after replacing value: ${value}`, e);
          return null; 
        }
      }).filter(item => item !== null);

      setFormattedJson(JSON.stringify(results, null, 2));
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
    setFormattedJson('');
    showSuccess("Content cleared.");
  };

  return (
    <div className="p-8 pt-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">JSON Formatter</h2>
      <Card>
        <CardHeader>
          <CardTitle>Batch JSON Generator & Formatter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Current Template (from Settings):
              </label>
              <div className="relative">
                <Textarea
                  readOnly
                  value={currentTemplate}
                  className="font-mono text-xs resize-none h-20 bg-muted/50"
                />
                <CopyButton content={currentTemplate} label="Template" className="absolute top-2 right-2 h-7 w-7" />
              </div>
              <p className="text-xs text-muted-foreground">
                The placeholder is <code className="bg-muted p-1 rounded text-primary font-mono">{PLACEHOLDER}</code>. Edit this template in the Settings page.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 h-[60vh]">
            {/* Left Panel: Raw Input List */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Input List (Comma or Newline Separated)</label>
                <CopyButton content={rawInput} label="Input List" className="h-7 w-7" />
              </div>
              <Textarea
                placeholder="Paste values here (e.g., FundA, FundB, FundC)"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="flex-1 font-mono text-xs resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Middle Controls */}
            <div className="flex flex-row lg:flex-col items-center justify-center gap-4 p-4 lg:p-0">
              <Button onClick={handleBatchConvert} size="icon" title="Generate JSON Array">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              </Button>
              <Button onClick={handleClear} variant="outline" size="icon" title="Clear All">
                <Eraser className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Panel: Generated JSON Array */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Generated JSON Array</label>
                <CopyButton content={formattedJson} label="Generated JSON" className="h-7 w-7" />
              </div>
              <Textarea
                readOnly
                value={formattedJson}
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

export default JsonFormatter;