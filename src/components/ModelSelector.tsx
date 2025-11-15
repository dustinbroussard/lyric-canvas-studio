import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { openRouterModels } from '@/lib/openrouter';

export function ModelSelector() {
  const { selectedModelId, setSelectedModelId, showFreeModelsOnly, setShowFreeModelsOnly } = useAppStore();

  const filteredModels = showFreeModelsOnly 
    ? openRouterModels.filter(m => m.isFree)
    : openRouterModels;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>AI Model</Label>
        <div className="flex items-center gap-2">
          <Switch
            id="free-only"
            checked={showFreeModelsOnly}
            onCheckedChange={setShowFreeModelsOnly}
          />
          <Label htmlFor="free-only" className="text-xs cursor-pointer">
            Free only
          </Label>
        </div>
      </div>

      <Select value={selectedModelId} onValueChange={setSelectedModelId}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filteredModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                <span>{model.name}</span>
                <Badge variant={model.isFree ? "secondary" : "outline"} className="text-xs">
                  {model.costTier}
                </Badge>
                {model.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
