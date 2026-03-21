'use client';

import { useEffect, useState } from 'react';
import { Weapon, FilterState, ViewMode } from '@/lib/types';
import { loadWeapons, filterWeapons } from '@/lib/weapons-utils';
import { getMaxedWeapons } from '@/lib/maxed-weapons';
import { useLanguage } from '@/lib/language-context';
import { FilterPanel } from '@/components/filter-panel';
import { SearchBar } from '@/components/search-bar';
import { WeaponCard } from '@/components/weapon-card';
import { WeaponList } from '@/components/weapon-list';
import { WeaponTable } from '@/components/weapon-table';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Layout, Grid3x3, List } from 'lucide-react';

export default function WeaponsPage() {
  const { t, language } = useLanguage();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<Weapon[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [filterOpen, setFilterOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    rarity: new Set(),
    weaponType: new Set(),
    domains: new Set(),
    attributeStats: new Set(),
    secondaryStats: new Set(),
    skillStats: new Set(),
    searchQuery: '',
    showMaxedWeapons: false,
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await loadWeapons(language);
        setWeapons(data);
        setFilteredWeapons(data);
      } catch (error) {
        console.error('Error loading weapons:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [language]);

  useEffect(() => {
    let filtered = filterWeapons(weapons, filters);

    // Filter out maxed weapons if showMaxedWeapons is false
    if (!filters.showMaxedWeapons) {
      const maxedWeapons = getMaxedWeapons();
      filtered = filtered.filter(w => !maxedWeapons.has(w.name));
    }

    setFilteredWeapons(filtered);
  }, [weapons, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading weapons database...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-foreground">{t('header.title')}</h1>
            <LanguageSwitcher />
          </div>
          <p className="text-muted-foreground mb-6">
            {t('header.description')}
          </p>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Panel */}
        <FilterPanel
          weapons={weapons}
          filters={filters}
          onFilterChange={setFilters}
          isOpen={filterOpen}
          onToggle={setFilterOpen}
        />

        {/* View Controls - COMMENTED OUT */}
        {/* <div className="flex items-center justify-between py-4 border-b border-border mb-6">
          <div className="text-sm font-medium text-foreground">
            Showing {filteredWeapons.length} of {weapons.length} weapons
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              title="List View"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'card'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              title="Card View"
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              title="Table View"
            >
              <Layout className="h-5 w-5" />
            </button>
          </div>
        </div> */}

        <div className="pb-12 overflow-visible">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-9 gap-3 overflow-visible pt-12">
            {filteredWeapons.map(weapon => (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                onMaxedChange={(isMaxed) => {
                  // Auto-hide maxed weapon if showMaxedWeapons is false and weapon is marked as maxed
                  if (isMaxed && !filters.showMaxedWeapons) {
                    setFilteredWeapons(prev => prev.filter(w => w.id !== weapon.id));
                  }
                }}
              />
            ))}
          </div>

          {/* Commented out List and Table views */}
          {/* {viewMode === 'list' && <WeaponList weapons={filteredWeapons} />}
          {viewMode === 'table' && <WeaponTable weapons={filteredWeapons} />} */}

          {filteredWeapons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No weapons found matching your filters.</p>
              <button
                onClick={() =>
                  setFilters({
                    rarity: new Set(),
                    weaponType: new Set(),
                    domains: new Set(),
                    attributeStats: new Set(),
                    secondaryStats: new Set(),
                    skillStats: new Set(),
                    searchQuery: '',
                    showMaxedWeapons: false,
                  })
                }
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
