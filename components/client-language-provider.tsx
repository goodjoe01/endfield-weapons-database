'use client';

import { LanguageProvider } from '@/lib/language-context';

export function ClientLanguageProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
