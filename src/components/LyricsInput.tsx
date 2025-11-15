import { Textarea } from '@/components/ui/textarea';
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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        Song Lyrics
      </label>
      <Textarea
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        placeholder="Paste your lyrics here. Verses, chorus, bridge – I'll translate the story into visuals…"
        className="min-h-[200px] resize-y font-mono text-sm"
      />
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>{stats.words} words</span>
        <span>{stats.lines} lines</span>
      </div>
    </div>
  );
}
