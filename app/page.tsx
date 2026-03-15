'use client';

import { useEffect, useState } from 'react';
import { Weapon, FilterState, ViewMode } from '@/lib/types';
import { loadWeapons, filterWeapons } from '@/lib/weapons-utils';
import { FilterPanel } from '@/components/filter-panel';
import { SearchBar } from '@/components/search-bar';
import { WeaponCard } from '@/components/weapon-card';
import { WeaponList } from '@/components/weapon-list';
import { WeaponTable } from '@/components/weapon-table';
import { Layout, Grid3x3, List } from 'lucide-react';

export default function WeaponsPage() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<Weapon[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [filterOpen, setFilterOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    rarity: new Set(),
    domains: new Set(),
    attributeStats: new Set(),
    skillStats: new Set(),
    searchQuery: '',
  });

  useEffect(() => {
    loadWeapons()
      .then(data => {
        setWeapons(data);
        setFilteredWeapons(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading weapons:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = filterWeapons(weapons, filters);
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Weapons Database</h1>
          <p className="text-muted-foreground mb-6">
            Browse and filter {weapons.length} weapons by rarity, domains, attributes, and skills.
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

        {/* View Controls */}
        <div className="flex items-center justify-between py-4 border-b border-border mb-6">
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
        </div>

        {/* Weapons Display */}
        <div className="pb-12">
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWeapons.map(weapon => (
                <WeaponCard key={weapon.id} weapon={weapon} />
              ))}
            </div>
          )}

          {viewMode === 'list' && <WeaponList weapons={filteredWeapons} />}

          {viewMode === 'table' && <WeaponTable weapons={filteredWeapons} />}

          {filteredWeapons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No weapons found matching your filters.</p>
              <button
                onClick={() =>
                  setFilters({
                    rarity: new Set(),
                    domains: new Set(),
                    attributeStats: new Set(),
                    skillStats: new Set(),
                    searchQuery: '',
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
