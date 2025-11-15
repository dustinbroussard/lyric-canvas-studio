import { Header } from '@/components/Header';
import { LyricsInput } from '@/components/LyricsInput';
import { ModelSelector } from '@/components/ModelSelector';
import { PresetSelector } from '@/components/PresetSelector';
import { PromptOutput } from '@/components/PromptOutput';
import { GenerateButton } from '@/components/GenerateButton';
import { SettingsDialog } from '@/components/SettingsDialog';
import { HistoryDialog } from '@/components/HistoryDialog';
import { InstallPrompt } from '@/components/InstallPrompt';
import { useState } from 'react';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <LyricsInput />
            
            <div className="grid sm:grid-cols-2 gap-4">
              <ModelSelector />
              <PresetSelector />
            </div>
            
            <GenerateButton />
          </div>

          {/* Right Panel - Output */}
          <div className="lg:sticky lg:top-24 h-fit">
            <PromptOutput />
          </div>
        </div>
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <HistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} />
      <InstallPrompt />
    </div>
  );
};

export default Index;
