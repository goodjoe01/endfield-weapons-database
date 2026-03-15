'use client';

import { useState } from 'react';
import { FilterState, Weapon } from '@/lib/types';
import {
  getUniqueDomains,
  getUniqueAttributeStats,
  getUniqueSkillStats,
} from '@/lib/weapons-utils';

interface FilterPanelProps {
  weapons: Weapon[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function FilterPanel({
  weapons,
  filters,
  onFilterChange,
  isOpen,
  onToggle,
}: FilterPanelProps) {
  const domains = getUniqueDomains(weapons);
  const attributeStats = getUniqueAttributeStats(weapons);
  const skillStats = getUniqueSkillStats(weapons);

  const handleRarityChange = (rarity: number, checked: boolean) => {
    const newRarity = new Set(filters.rarity);
    if (checked) {
      newRarity.add(rarity);
    } else {
      newRarity.delete(rarity);
    }
    onFilterChange({ ...filters, rarity: newRarity });
  };

  const handleDomainChange = (domain: string, checked: boolean) => {
    const newDomains = new Set(filters.domains);
    if (checked) {
      newDomains.add(domain);
    } else {
      newDomains.delete(domain);
    }
    onFilterChange({ ...filters, domains: newDomains });
  };

  const handleAttributeChange = (attr: string, checked: boolean) => {
    const newAttrs = new Set(filters.attributeStats);
    if (checked) {
      newAttrs.add(attr);
    } else {
      newAttrs.delete(attr);
    }
    onFilterChange({ ...filters, attributeStats: newAttrs });
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    const newSkills = new Set(filters.skillStats);
    if (checked) {
      newSkills.add(skill);
    } else {
      newSkills.delete(skill);
    }
    onFilterChange({ ...filters, skillStats: newSkills });
  };

  const handleClearFilters = () => {
    onFilterChange({
      rarity: new Set(),
      domains: new Set(),
      attributeStats: new Set(),
      skillStats: new Set(),
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.rarity.size > 0 ||
    filters.domains.size > 0 ||
    filters.attributeStats.size > 0 ||
    filters.skillStats.size > 0;

  return (
    <div className="border-b border-border bg-background">
      <div className="px-4 py-3 flex items-center justify-between lg:hidden">
        <button
          onClick={() => onToggle(!isOpen)}
          className="text-sm font-medium text-foreground hover:text-primary"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Rarity Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Rarity</h3>
            <div className="space-y-2">
              {[3, 4, 5, 6].map(rarity => (
                <label key={rarity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.rarity.has(rarity)}
                    onChange={e => handleRarityChange(rarity, e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground">{rarity}-Star</span>
                </label>
              ))}
            </div>
          </div>

          {/* Domains Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Energy Alluvium</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {domains.map(domain => (
                <label key={domain} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.domains.has(domain)}
                    onChange={e => handleDomainChange(domain, e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground truncate">{domain}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Attribute Stats Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Attribute Stats</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attributeStats.map(attr => (
                <label key={attr} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.attributeStats.has(attr)}
                    onChange={e => handleAttributeChange(attr, e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground truncate">{attr}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skill Stats Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Skill Stats</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {skillStats.map(skill => (
                <label key={skill} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.skillStats.has(skill)}
                    onChange={e => handleSkillChange(skill, e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground truncate">{skill}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Clear Button */}
      {hasActiveFilters && (
        <div className="hidden lg:block border-t border-border px-4 py-2">
          <button
            onClick={handleClearFilters}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
