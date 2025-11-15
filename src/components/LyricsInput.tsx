import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

export function LyricsInput() {
  const { lyrics, setLyrics } = useAppStore();

  const stats = useMemo(() => {
    const words = lyrics.trim().split(/\s+/).filter(Boolean).length;
    const lines = lyrics.split('\n').length;
    return { words, lines };
  }, [lyrics]);

  return (
    <Card className="p-4 space-y-3 shadow-lg hover:shadow-xl transition-shadow">
      <Label htmlFor="lyrics" className="text-base font-semibold">Song Lyrics</Label>
      <Textarea
        id="lyrics"
        placeholder="Paste your lyrics here. Verses, chorus, bridge – I'll translate the story into visuals..."
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        className="min-h-[200px] font-mono text-sm resize-none"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">{stats.words} words • {stats.lines} lines</span>
        {lyrics && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLyrics('')}
            className="h-7 px-2 hover:text-destructive"
          >
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}
