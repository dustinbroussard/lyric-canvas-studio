import { Moon, Sun, Settings, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

type HeaderProps = {
  onOpenSettings: () => void;
  onOpenHistory: () => void;
};

export function Header({ onOpenSettings, onOpenHistory }: HeaderProps) {
  const { theme, setTheme } = useAppStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (mode: 'light' | 'dark') => {
      setIsDark(mode === 'dark');
      root.classList.toggle('dark', mode === 'dark');
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event: MediaQueryListEvent) => {
        applyTheme(event.matches ? 'dark' : 'light');
      };

      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    applyTheme(theme);
    return undefined;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-card/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Lyric-to-Canvas
          </h1>
          <p className="text-sm text-muted-foreground">Cover art prompt studio</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hover:scale-110 transition-transform"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHistory}
            aria-label="View history"
            className="hover:scale-110 transition-transform"
          >
            <History className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="hover:scale-110 transition-transform"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
