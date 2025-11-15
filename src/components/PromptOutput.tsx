import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';

export function PromptOutput() {
  const { generatedPrompt, generatedNegativePrompt } = useAppStore();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const copyToClipboard = async (text: string, isNegative: boolean) => {
    await navigator.clipboard.writeText(text);
    if (isNegative) {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <Card className="p-4 space-y-4 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Generated Prompt</Label>
        {generatedPrompt && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(generatedPrompt, false)}
            className="gap-2"
          >
            {copiedPrompt ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedPrompt ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </div>

      <div className="relative min-h-[300px] rounded-xl border bg-muted/30 p-4 shadow-inner">
        {generatedPrompt ? (
          <ScrollArea className="h-[300px]">
            <p className="text-sm font-mono whitespace-pre-wrap leading-relaxed">{generatedPrompt}</p>
          </ScrollArea>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-4">✨</div>
              <p>Your generated prompt will appear here.</p>
              <p className="text-xs">Fill in lyrics and click Generate to start.</p>
            </div>
          </div>
        )}
      </div>

      {generatedNegativePrompt && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Negative Prompt</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(generatedNegativePrompt, true)}
              className="gap-2 h-8"
            >
              {copiedNegative ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedNegative ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3 shadow-inner">
            <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed">{generatedNegativePrompt}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
