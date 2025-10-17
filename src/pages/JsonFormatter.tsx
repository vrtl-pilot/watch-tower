import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Eraser } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { CopyButton } from '@/components/CopyButton';

const JsonFormatter = () => {
  const [rawText, setRawText] = useState('');
  const [formattedJson, setFormattedJson] = useState('');

  const formatToJson = () => {
    if (!rawText.trim()) {
      setFormattedJson('');
      return;
    }
    try {
      const parsed = JSON.parse(rawText);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      showSuccess("Text successfully formatted to JSON.");
    } catch (e) {
      showError("Invalid JSON format in the Text area.");
      setFormattedJson('Error: Invalid JSON input.');
    }
  };

  const formatToText = () => {
    if (!formattedJson.trim()) {
      setRawText('');
      return;
    }
    try {
      const parsed = JSON.parse(formattedJson);
      // Convert back to compact text (no indentation)
      setRawText(JSON.stringify(parsed));
      showSuccess("JSON successfully converted to compact text.");
    } catch (e) {
      showError("Invalid JSON format in the JSON area.");
      setRawText('Error: Invalid JSON input.');
    }
  };

  const handleClear = () => {
    setRawText('');
    setFormattedJson('');
    showSuccess("Content cleared.");
  };

  return (
    <div className="p-8 pt-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">JSON Formatter</h2>
      <Card>
        <CardHeader>
          <CardTitle>Text & JSON Conversion Utility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 h-[60vh]">
            {/* Left Panel: Raw Text */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Raw Text</label>
                <CopyButton content={rawText} label="Raw Text" className="h-7 w-7" />
              </div>
              <Textarea
                placeholder="Paste raw text or compact JSON here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="flex-1 font-mono text-xs resize-none"
              />
            </div>

            {/* Middle Controls */}
            <div className="flex flex-row lg:flex-col items-center justify-center gap-4 p-4 lg:p-0">
              <Button onClick={formatToJson} size="icon" title="Format to JSON">
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button onClick={formatToText} size="icon" title="Convert to Text">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button onClick={handleClear} variant="outline" size="icon" title="Clear All">
                <Eraser className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Panel: Formatted JSON */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Formatted JSON</label>
                <CopyButton content={formattedJson} label="Formatted JSON" className="h-7 w-7" />
              </div>
              <Textarea
                placeholder="Formatted JSON will appear here..."
                value={formattedJson}
                onChange={(e) => setFormattedJson(e.target.value)}
                className="flex-1 font-mono text-xs resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonFormatter;