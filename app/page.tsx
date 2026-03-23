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
    <main className="min-h-screen bg-background flex flex-col">
      {/* Contact Banner - Top */}
      <div className="bg-orange-600/20 border-b border-orange-600/50 px-4 py-2">
        <div className="max-w-7xl mx-auto text-center">
          <a
            href="https://www.tiktok.com/@goodjoe01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
          >
            Follow @goodjoe01 on TikTok
          </a>
        </div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4 py-6 flex-1">
        {/* Filter Panel */}
        <FilterPanel
          weapons={weapons}
          filters={filters}
          onFilterChange={setFilters}
          isOpen={filterOpen}
          onToggle={setFilterOpen}
        />
        <div className="pb-12 overflow-visible">
          {/* Weapons Counter */}
          <div className="my-2 text-sm font-medium text-foreground">
            {language === 'en'
              ? `Showing ${filteredWeapons.length} of ${weapons.length} weapons`
              : `Mostrando ${filteredWeapons.length} de ${weapons.length} armas`
            }
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-9 gap-3 overflow-visible">
            {filteredWeapons.map(weapon => (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                onMaxedChange={(isMaxed) => {
                  if (isMaxed && !filters.showMaxedWeapons) {
                    setFilteredWeapons(prev => prev.filter(w => w.id !== weapon.id));
                  }
                }}
              />
            ))}
          </div>

          {filteredWeapons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No weapons found matching your filters.
              </p>
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Panel */}
        <FilterPanel
          weapons={weapons}
          filters={filters}
          onFilterChange={setFilters}
          isOpen={filterOpen}
          onToggle={setFilterOpen}
        />

        <div className="pb-12 overflow-visible">
          {/* Weapons Counter */}
          <div className="my-2 text-sm font-medium text-foreground">
            {language === 'en'
              ? `Showing ${filteredWeapons.length} of ${weapons.length} weapons`
              : `Mostrando ${filteredWeapons.length} de ${weapons.length} armas`
            }
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-9 gap-3 overflow-visible">
            {filteredWeapons.map(weapon => (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                onMaxedChange={(isMaxed) => {
                  if (isMaxed && !filters.showMaxedWeapons) {
                    setFilteredWeapons(prev => prev.filter(w => w.id !== weapon.id));
                  }
                }}
              />
            ))}
          </div>

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

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <h3 className="text-foreground font-semibold mb-4">Follow Me</h3>
              <div className="flex gap-6 justify-center flex-wrap">
                <a
                  href="https://www.tiktok.com/@goodjoe01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-orange-400 transition-colors font-medium"
                >
                  TikTok
                </a>
                <a
                  href="https://www.twitch.tv/goodjoe01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-purple-400 transition-colors font-medium"
                >
                  Twitch
                </a>
                <a
                  href="https://kick.com/goodjoe01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-green-400 transition-colors font-medium"
                >
                  Kick
                </a>
                <a
                  href="https://www.youtube.com/@goodjoee01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-red-400 transition-colors font-medium"
                >
                  YouTube
                </a>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border w-full space-y-2">
              <p>Weapons Database © 2024 | Built with passion</p>
              <p className="text-xs leading-relaxed">
                Unofficial fan project. Not affiliated with Hypergryph or Gryphline. Game assets and data belong to their respective owners.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
