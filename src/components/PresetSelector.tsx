import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';

export function PresetSelector() {
  const { presets, selectedPresetId, setSelectedPresetId } = useAppStore();

  return (
    <Card className="p-4 space-y-3 shadow-lg hover:shadow-xl transition-shadow">
      <Label className="text-base font-semibold">Style Preset</Label>
      
      <Select value={selectedPresetId || undefined} onValueChange={setSelectedPresetId}>
        <SelectTrigger className="shadow-sm">
          <SelectValue placeholder="Choose a style..." />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {presets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">{preset.name}</span>
                {preset.description && (
                  <span className="text-xs text-muted-foreground line-clamp-2">{preset.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}
