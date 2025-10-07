
import React from 'react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const themes = [
  { value: 'blue', label: 'Blu (Default)', color: 'hsl(221 83% 53%)' },
  { value: 'red', label: 'Rosso', color: 'hsl(0 84.2% 60.2%)' },
  { value: 'green', label: 'Verde', color: 'hsl(142.1 76.2% 36.3%)' },
  { value: 'yellow', label: 'Giallo', color: 'hsl(47.9 95.8% 53.1%)' },
  { value: 'pink', label: 'Rosa', color: 'hsl(322.1 91.4% 56.1%)' },
  { value: 'purple', label: 'Viola', color: 'hsl(262.1 83.3% 57.8%)' },
  { value: 'indigo', label: 'Indaco', color: 'hsl(225.9 78.5% 53.7%)' },
  { value: 'teal', label: 'Verde Acqua', color: 'hsl(169.3 80.6% 32.7%)' },
  { value: 'orange', label: 'Arancione', color: 'hsl(24.6 95% 53.1%)' },
  { value: 'cyan', label: 'Ciano', color: 'hsl(189.6 94.1% 42%)' },
  { value: 'emerald', label: 'Smeraldo', color: 'hsl(158.3 79.9% 38.2%)' },
  { value: 'rose', label: 'Rosa Antico', color: 'hsl(346.8 91.2% 56.5%)' },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <LiquidGlass intensity="medium" size="md">
      <h3 className="font-medium text-white mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        <span>Tema Applicazione</span>
      </h3>
      <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona un tema" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span>{t.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </LiquidGlass>
  );
};

export default ThemeSwitcher;
