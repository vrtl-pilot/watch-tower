import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eraser, Save } from 'lucide-react';
import { useJsonTemplate, PLACEHOLDER } from '@/hooks/use-json-template';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { template: savedTemplate, setTemplate, resetTemplate } = useJsonTemplate();
  const [localTemplate, setLocalTemplate] = useState(savedTemplate);

  // Sync local state with store on initial load/reset
  useEffect(() => {
    setLocalTemplate(savedTemplate);
  }, [savedTemplate]);

  const handleSave = () => {
    if (!localTemplate.trim()) {
      showError("Template cannot be empty.");
      return;
    }
    if (!localTemplate.includes(PLACEHOLDER)) {
      showError(`Template must contain the placeholder: ${PLACEHOLDER}`);
      return;
    }
    try {
      // Quick check to ensure the template is valid JSON structure after replacement
      JSON.parse(localTemplate.replace(new RegExp(PLACEHOLDER, 'g'), 'TEST_VALUE'));
      setTemplate(localTemplate);
      showSuccess("JSON Template saved successfully.");
    } catch (e) {
      showError("Invalid JSON format. Please ensure the template is valid JSON.");
    }
  };

  const handleReset = () => {
    resetTemplate();
    showSuccess("JSON Template reset to default.");
  };

  return (
    <div className="p-8 pt-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>JSON Formatter Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Default JSON Template (Use <code className="bg-muted p-1 rounded text-primary font-mono">{PLACEHOLDER}</code> as placeholder)
            </label>
            <Textarea
              value={localTemplate}
              onChange={(e) => setLocalTemplate(e.target.value)}
              className="font-mono text-xs resize-none h-40"
              placeholder={`{"fundName": "${PLACEHOLDER}", "dateType": "oneDay", "env": "production"}`}
            />
            <p className="text-xs text-muted-foreground">
              This template is used by default on the JSON Formatter page. It is saved locally in your browser.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              <Eraser className="mr-2 h-4 w-4" /> Reset to Default
            </Button>
            <Button onClick={handleSave} disabled={localTemplate === savedTemplate}>
              <Save className="mr-2 h-4 w-4" /> Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;