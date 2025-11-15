import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

  if (!generatedPrompt) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Your generated prompt will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Full Prompt</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(generatedPrompt, false)}
          >
            {copiedPrompt ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap font-mono bg-muted p-3 rounded-md">
          {generatedPrompt}
        </p>
      </Card>

      {generatedNegativePrompt && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Negative Prompt</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(generatedNegativePrompt, true)}
            >
              {copiedNegative ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap font-mono bg-muted p-3 rounded-md">
            {generatedNegativePrompt}
          </p>
        </Card>
      )}
    </div>
  );
}
