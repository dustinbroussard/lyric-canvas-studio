import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { generatePromptFromLyrics } from '@/lib/openrouter';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function GenerateButton() {
  const {
    lyrics,
    apiKey,
    selectedModelId,
    selectedPresetId,
    presets,
    isGenerating,
    setIsGenerating,
    setGeneratedPrompt,
    addHistoryEntry,
  } = useAppStore();

  const handleGenerate = async () => {
    if (!lyrics.trim()) {
      toast.error('Please enter some lyrics first');
      return;
    }

    if (!apiKey) {
      toast.error('Please add your OpenRouter API key in settings');
      return;
    }

    setIsGenerating(true);
    
    try {
      const preset = presets.find(p => p.id === selectedPresetId);
      
      toast.info('Analyzing lyrics and generating prompt...');
      
      const { fullPrompt, negativePrompt } = await generatePromptFromLyrics(
        lyrics,
        selectedModelId,
        apiKey,
        preset?.baseStylePrompt,
        preset?.negativePromptAdditions
      );

      setGeneratedPrompt(fullPrompt, negativePrompt);
      
      addHistoryEntry({
        lyrics,
        modelId: selectedModelId,
        presetId: selectedPresetId,
        fullPrompt,
        negativePrompt,
      });

      toast.success('Prompt generated successfully!');
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isGenerating || !lyrics.trim()}
      className="w-full"
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Prompt'
      )}
    </Button>
  );
}
