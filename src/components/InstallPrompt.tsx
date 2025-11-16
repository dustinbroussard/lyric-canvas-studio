import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
    if (isStandalone || navigatorWithStandalone.standalone) {
      return;
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user dismissed this session
      const dismissedThisSession = sessionStorage.getItem('pwa-install-dismissed');
      if (!dismissedThisSession) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('PWA install prompt failed', error);
      toast.error('Failed to open install prompt. Please try again.');
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:max-w-sm">
      <Card className="relative overflow-hidden border-primary/20 bg-card/95 backdrop-blur-lg shadow-xl">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        
        <div className="relative p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="absolute top-2 right-2 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-start gap-3 pr-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-md">
              <Download className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-foreground">Install Lyric-to-Canvas</h3>
              <p className="text-sm text-muted-foreground">
                Add to your home screen for quick access and offline use.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-gradient-primary hover:opacity-90 shadow-md"
            >
              Install App
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Not Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
