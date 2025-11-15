import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';

export function PresetSelector() {
  const { presets, selectedPresetId, setSelectedPresetId } = useAppStore();

  return (
    <div className="flex flex-col gap-3">
      <Label>Style Preset</Label>
      <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              <div className="flex flex-col">
                <span className="font-medium">{preset.name}</span>
                <span className="text-xs text-muted-foreground">{preset.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
