import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { Copy, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

type HistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HistoryDialog({ open, onOpenChange }: HistoryDialogProps) {
  const { history, deleteHistoryEntry, loadHistoryEntry, clearHistory } = useAppStore();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleLoad = (entry: typeof history[0]) => {
    loadHistoryEntry(entry);
    onOpenChange(false);
    toast.success('Loaded into editor');
  };

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    toast.success('Deleted from history');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      toast.success('History cleared');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Generation History</DialogTitle>
              <DialogDescription>
                View and manage your past prompt generations
              </DialogDescription>
            </div>
            {history.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No history yet</p>
              <p className="text-sm">Generate your first prompt to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <Card key={entry.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium">
                          {entry.modelId.split('/')[1]} • {entry.presetId}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(entry.fullPrompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleLoad(entry)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <p className="text-muted-foreground mb-1">Lyrics preview:</p>
                      <p className="line-clamp-2 font-mono bg-muted p-2 rounded">
                        {entry.lyrics}
                      </p>
                    </div>

                    <div className="text-xs">
                      <p className="text-muted-foreground mb-1">Generated prompt:</p>
                      <p className="line-clamp-3 font-mono bg-muted p-2 rounded">
                        {entry.fullPrompt}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
