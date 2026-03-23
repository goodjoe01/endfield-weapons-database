'use client';

import { useLanguage } from '@/lib/language-context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-secondary/30 transition-colors cursor-pointer">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
        className="bg-transparent text-sm font-medium text-foreground cursor-pointer appearance-none outline-none"
      >
        <option value="en" className="bg-background text-foreground">{t('common.english')}</option>
        <option value="es" className="bg-background text-foreground">{t('common.spanish')}</option>
      </select>
    </div>
  );
}
