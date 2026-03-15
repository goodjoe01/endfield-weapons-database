'use client';

import { useState } from 'react';
import { FilterState, Weapon } from '@/lib/types';
import {
  getUniqueDomains,
  getUniqueAttributeStats,
  getUniqueSecondaryStats,
  getUniqueSkillStats,
  getUniqueWeaponTypes,
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
  const secondaryStats = getUniqueSecondaryStats(weapons);
  const skillStats = getUniqueSkillStats(weapons).filter(s => s && s.trim());
  const weaponTypes = getUniqueWeaponTypes(weapons);

  const handleRarityChange = (rarity: number, checked: boolean) => {
    const newRarity = new Set(filters.rarity);
    if (checked) {
      newRarity.add(rarity);
    } else {
      newRarity.delete(rarity);
    }
    onFilterChange({ ...filters, rarity: newRarity });
  };

  const handleWeaponTypeChange = (type: string, checked: boolean) => {
    const newTypes = new Set(filters.weaponType);
    if (checked) {
      newTypes.add(type);
    } else {
      newTypes.delete(type);
    }
    onFilterChange({ ...filters, weaponType: newTypes });
  };

  const handleDomainChange = (domain: string) => {
    const newDomains = domain === '' ? new Set<string>() : new Set([domain]);
    onFilterChange({ ...filters, domains: newDomains });
  };

  const handleAttributeChange = (attr: string) => {
    if (attr === '') {
      onFilterChange({ ...filters, attributeStats: new Set() });
    } else {
      onFilterChange({ ...filters, attributeStats: new Set([attr]) });
    }
  };

  const handleSecondaryChange = (stat: string) => {
    const newStats = stat === '' ? new Set<string>() : new Set([stat]);
    onFilterChange({ ...filters, secondaryStats: newStats });
  };

  const handleSkillChange = (skill: string) => {
    const newSkills = skill === '' ? new Set<string>() : new Set([skill]);
    onFilterChange({ ...filters, skillStats: newSkills });
  };

  const handleClearFilters = () => {
    onFilterChange({
      rarity: new Set(),
      weaponType: new Set(),
      domains: new Set(),
      attributeStats: new Set(),
      secondaryStats: new Set(),
      skillStats: new Set(),
      searchQuery: '',
      showMaxedWeapons: false,
    });
  };

  const hasActiveFilters =
    filters.rarity.size > 0 ||
    filters.weaponType.size > 0 ||
    filters.domains.size > 0 ||
    filters.attributeStats.size > 0 ||
    (filters.secondaryStats?.size ?? 0) > 0 ||
    filters.skillStats.size > 0;

  const FilterSelect = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 bg-card border border-border rounded text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          paddingRight: '28px',
        }}
      >
        <option value="">None</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="border-b border-border bg-card">
      {/* Top Filter Bar - Rarity and Weapon Type */}
      <div className="border-b border-border px-4 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Rarity Filters */}
          <div className="flex gap-2 items-center flex-wrap">
            {[3, 4, 5, 6].map(rarity => (
              <button
                key={rarity}
                onClick={() =>
                  handleRarityChange(rarity, !filters.rarity.has(rarity))
                }
                className={`px-3 py-1.5 text-xs font-semibold uppercase rounded border transition-colors ${
                  filters.rarity.has(rarity)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                }`}
              >
                ★ {rarity}★
              </button>
            ))}
          </div>

          {/* Weapon Type Filters */}
          {weaponTypes.length > 0 && (
            <div className="flex gap-2 items-center flex-wrap pl-4 border-l border-border">
              {weaponTypes.map(type => (
                <button
                  key={type}
                  onClick={() =>
                    handleWeaponTypeChange(type, !filters.weaponType.has(type))
                  }
                  className={`px-3 py-1.5 text-xs font-semibold uppercase rounded border transition-colors ${
                    filters.weaponType.has(type)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Dropdown Filters */}
      <div className="px-4 py-4 flex flex-wrap gap-4 items-end">
        <FilterSelect
          label="Attribute Stats"
          value={Array.from(filters.attributeStats)[0] ?? ''}
          options={attributeStats}
          onChange={handleAttributeChange}
        />
        <FilterSelect
          label="Secondary Stats"
          value={Array.from(filters.secondaryStats)[0] ?? ''}
          options={secondaryStats}
          onChange={handleSecondaryChange}
        />
        <FilterSelect
          label="Skill Stats"
          value={Array.from(filters.skillStats)[0] ?? ''}
          options={skillStats}
          onChange={handleSkillChange}
        />
        <FilterSelect
          label="Energy Alluvium"
          value={Array.from(filters.domains)[0] ?? ''}
          options={domains}
          onChange={handleDomainChange}
        />

        {/* Show Maxed Weapons */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs font-semibold text-foreground flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showMaxedWeapons}
              onChange={e =>
                onFilterChange({ ...filters, showMaxedWeapons: e.target.checked })
              }
              className="rounded border-input"
            />
            <span>Show maxed</span>
          </label>
        </div>
      </div>
    </div>
  );
}
