'use client';

import { FilterState } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function SearchBar({ filters, onFilterChange }: SearchBarProps) {
  const { language } = useLanguage();

  const placeholders = {
    en: 'Search weapons by name, stats, skill...',
    es: 'Buscar armas por nombre, estadísticas, habilidad...',
  };

  const handleSearchChange = (query: string) => {
    onFilterChange({ ...filters, searchQuery: query });
  };

  const handleClear = () => {
    onFilterChange({ ...filters, searchQuery: '' });
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder={placeholders[language as keyof typeof placeholders]}
        value={filters.searchQuery}
        onChange={e => handleSearchChange(e.target.value)}
        className="w-full pl-10 pr-10 py-1 sm:py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-background"
      />
      {filters.searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
