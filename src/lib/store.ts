import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PromptPreset = {
  id: string;
  name: string;
  description: string;
  baseStylePrompt: string;
  negativePromptAdditions?: string;
  defaultAspectRatio?: string;
  isBuiltIn: boolean;
};

export type HistoryEntry = {
  id: string;
  timestamp: number;
  lyrics: string;
  modelId: string;
  presetId: string | null;
  fullPrompt: string;
  negativePrompt?: string;
};

type AppState = {
  apiKey: string;
  theme: 'light' | 'dark' | 'system';
  lyrics: string;
  selectedModelId: string;
  selectedPresetId: string;
  showFreeModelsOnly: boolean;
  generatedPrompt: string;
  generatedNegativePrompt: string;
  isGenerating: boolean;
  presets: PromptPreset[];
  history: HistoryEntry[];
  
  setApiKey: (key: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLyrics: (lyrics: string) => void;
  setSelectedModelId: (id: string) => void;
  setSelectedPresetId: (id: string) => void;
  setShowFreeModelsOnly: (show: boolean) => void;
  setGeneratedPrompt: (prompt: string, negativePrompt?: string) => void;
  setIsGenerating: (generating: boolean) => void;
  addPreset: (preset: PromptPreset) => void;
  updatePreset: (preset: PromptPreset) => void;
  deletePreset: (id: string) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  loadHistoryEntry: (entry: HistoryEntry) => void;
};

const builtInPresets: PromptPreset[] = [
  {
    id: 'vogue-magazine',
    name: 'Vogue Magazine Cover',
    description: 'Ultra high-end editorial fashion photography with minimalist composition',
    baseStylePrompt: 'ultra high-end editorial fashion photography, minimalist composition, clean negative space for masthead and cover lines, flawless skin, soft studio lighting, precise rim light, shot on Phase One XF IQ4, 85mm lens, f/2.2, perfectly centered subject, glossy finish, subtle film grain',
    negativePromptAdditions: 'cluttered composition, busy background, poor lighting, amateur photography',
    defaultAspectRatio: '4:5',
    isBuiltIn: true,
  },
  {
    id: 'pinup-retro',
    name: 'Classic Pin-Up Art (Neo-Retro)',
    description: 'Stylized neo-retro pin-up art with bold lines and vintage color palette',
    baseStylePrompt: 'digital painting, neo-retro pin-up art, clean bold line work, smooth cel-shading, saturated vintage color palette, exaggerated dynamic pose, mid-century advertising style, inspired by Gil Elvgren and Shag, subtle halftone texture, soft canvas grain',
    negativePromptAdditions: 'photorealistic, 3D render, modern style, muted colors',
    defaultAspectRatio: '4:5',
    isBuiltIn: true,
  },
  {
    id: 'urban-photography',
    name: 'Photo-realistic Urban Landscape Photography',
    description: 'Cinematic street photography with moody atmosphere and gritty textures',
    baseStylePrompt: 'cinematic street photography, wide-angle composition, golden hour side lighting, deep bokeh, reflective puddles, gritty urban textures, shot on Kodak Portra 400, 35mm lens, f/1.8, subtle lens flare, volumetric haze, moody atmosphere',
    negativePromptAdditions: 'oversaturated, HDR, digital painting, illustration style',
    defaultAspectRatio: '16:9',
    isBuiltIn: true,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: '',
      theme: 'system',
      lyrics: '',
      selectedModelId: 'anthropic/claude-3.5-sonnet',
      selectedPresetId: 'vogue-magazine',
      showFreeModelsOnly: false,
      generatedPrompt: '',
      generatedNegativePrompt: '',
      isGenerating: false,
      presets: builtInPresets,
      history: [],
      
      setApiKey: (key) => set({ apiKey: key }),
      setTheme: (theme) => set({ theme }),
      setLyrics: (lyrics) => set({ lyrics }),
      setSelectedModelId: (id) => set({ selectedModelId: id }),
      setSelectedPresetId: (id) => set({ selectedPresetId: id }),
      setShowFreeModelsOnly: (show) => set({ showFreeModelsOnly: show }),
      setGeneratedPrompt: (prompt, negativePrompt) => set({ 
        generatedPrompt: prompt,
        generatedNegativePrompt: negativePrompt || ''
      }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      addPreset: (preset) => set((state) => ({ 
        presets: [...state.presets, preset] 
      })),
      updatePreset: (preset) => set((state) => ({
        presets: state.presets.map(p => p.id === preset.id ? preset : p)
      })),
      deletePreset: (id) => set((state) => ({
        presets: state.presets.filter(p => p.id !== id)
      })),
      addHistoryEntry: (entry) => set((state) => ({
        history: [
          {
            ...entry,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          },
          ...state.history,
        ].slice(0, 50) // Keep only last 50 entries
      })),
      deleteHistoryEntry: (id) => set((state) => ({
        history: state.history.filter(e => e.id !== id)
      })),
      clearHistory: () => set({ history: [] }),
      loadHistoryEntry: (entry) => set({
        lyrics: entry.lyrics,
        selectedModelId: entry.modelId,
        selectedPresetId: entry.presetId || '',
        generatedPrompt: entry.fullPrompt,
        generatedNegativePrompt: entry.negativePrompt || '',
      }),
    }),
    {
      name: 'lyric-to-canvas-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        theme: state.theme,
        presets: state.presets,
        history: state.history,
        selectedModelId: state.selectedModelId,
        selectedPresetId: state.selectedPresetId,
        showFreeModelsOnly: state.showFreeModelsOnly,
      }),
    }
  )
);
