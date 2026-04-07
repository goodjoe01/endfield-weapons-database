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
import { FarmingPlanner } from '@/components/farming-planner';
import { FarmingPlannerMobile } from '@/components/farming-planner-mobile';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Layout, Grid3x3, List, Pin } from 'lucide-react';

export default function WeaponsPage() {
  const { t, language } = useLanguage();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<Weapon[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [filterOpen, setFilterOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFarmingMode, setIsFarmingMode] = useState(false);
  const [selectedWeapons, setSelectedWeapons] = useState<Weapon[]>([]);
  const [isHeaderPinned, setIsHeaderPinned] = useState(false);
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

  // Save farming mode state to localStorage
  useEffect(() => {
    localStorage.setItem('farmingMode', JSON.stringify(isFarmingMode));
  }, [isFarmingMode]);

  useEffect(() => {
    localStorage.setItem('selectedWeapons', JSON.stringify(selectedWeapons.map(w => w.id)));
  }, [selectedWeapons]);

  // Load farming mode and selected weapons from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('farmingMode');
    const savedWeaponIds = localStorage.getItem('selectedWeapons');
    if (saved) setIsFarmingMode(JSON.parse(saved));
    if (savedWeaponIds && weapons.length > 0) {
      try {
        const weaponIds = JSON.parse(savedWeaponIds);
        const selected = weapons.filter(w => weaponIds.includes(w.id));
        setSelectedWeapons(selected);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [weapons]);

  const handleToggleWeaponSelection = (weapon: Weapon) => {
    setSelectedWeapons(prev => {
      const isSelected = prev.find(w => w.id === weapon.id);
      if (isSelected) {
        return prev.filter(w => w.id !== weapon.id);
      } else {
        return [...prev, weapon];
      }
    });
  };

  const handleRemoveSelectedWeapon = (weaponId: string) => {
    setSelectedWeapons(prev => prev.filter(w => w.id !== weaponId));
  };

  const handleToggleFarmingMode = () => {
    const newMode = !isFarmingMode;
    setIsFarmingMode(newMode);
    if (!newMode) {
      // Clear selection when disabling farming mode
      setSelectedWeapons([]);
    }
  };

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
      {/* Header */}
      <header className={`bg-background border-b border-border ${isHeaderPinned ? 'sticky top-0 z-40' : 'relative'}`}>
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-2">
          <div className="flex justify-between items-start mb-1 sm:mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t('header.title')}</h1>
            <div className="flex items-center gap-2">
              {/* Pin Button - Mobile Only */}
              <button
                onClick={() => setIsHeaderPinned(!isHeaderPinned)}
                className={`sm:hidden p-2 rounded transition-colors ${isHeaderPinned ? 'bg-orange-600/30 text-orange-400' : 'text-muted-foreground hover:text-foreground'}`}
                title={isHeaderPinned ? 'Unpin header' : 'Pin header'}
              >
                <Pin className="h-4 w-4" />
              </button>
              <LanguageSwitcher />
            </div>
          </div>
          <p className="hidden sm:block text-muted-foreground mb-6">
            {t('header.description')}
          </p>

          {/* Search Bar */}
          <div className="pb-1 sm:mb-4">
            <SearchBar filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-6 flex-1">
        {/* Filter Panel */}
        <FilterPanel
          weapons={weapons}
          filters={filters}
          onFilterChange={setFilters}
          isOpen={filterOpen}
          onToggle={setFilterOpen}
          isFarmingMode={isFarmingMode}
          onToggleFarmingMode={handleToggleFarmingMode}
          selectedWeaponsCount={selectedWeapons.length}
        />

        {/* Mobile Farming Planner */}
        {isFarmingMode && (
          <FarmingPlannerMobile
            selectedWeapons={selectedWeapons}
            onRemoveWeapon={handleRemoveSelectedWeapon}
            onClearAll={() => setSelectedWeapons([])}
          />
        )}
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
                isFarmingMode={isFarmingMode}
                isSelected={selectedWeapons.some(w => w.id === weapon.id)}
                onToggleSelect={handleToggleWeaponSelection}
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

      {/* Farming Planner Side Panel */}
      <FarmingPlanner
        selectedWeapons={selectedWeapons}
        onRemoveWeapon={handleRemoveSelectedWeapon}
        allWeapons={weapons}
        isOpen={isFarmingMode}
        onClose={() => {}}
      />

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <h3 className="text-foreground font-semibold mb-4">Socials</h3>
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
            <div className="text-xs text-muted-foreground text-center border-border w-full">
              <p className="text-xs leading-relaxed text-gray-100 font-medium">
                Unofficial fan project. Not affiliated with Hypergryph or Gryphline. Game assets and data belong to their respective owners.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
