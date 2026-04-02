'use client';

import { useState } from 'react';
import { FilterState, Weapon } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';
import {
  getUniqueDomains,
  getUniqueAttributeStats,
  getUniqueSecondaryStats,
  getUniqueSkillStats,
  getUniqueWeaponTypes,
  getDisplayWeaponType,
} from '@/lib/weapons-utils';
import { ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  weapons: Weapon[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  isFarmingMode?: boolean;
  onToggleFarmingMode?: () => void;
  selectedWeaponsCount?: number;
}

export function FilterPanel({
  weapons,
  filters,
  onFilterChange,
  isOpen,
  onToggle,
  isFarmingMode,
  onToggleFarmingMode,
  selectedWeaponsCount,
}: FilterPanelProps) {
  const { t, language } = useLanguage();
  const domains = getUniqueDomains(weapons);
  const attributeStats = getUniqueAttributeStats(weapons);
  const secondaryStats = getUniqueSecondaryStats(weapons);
  const skillStats = getUniqueSkillStats(weapons).filter(s => s && s.trim());
  const weaponTypes = getUniqueWeaponTypes(weapons);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const handleAttributeChange = (attr: string, checked: boolean) => {
    const newAttrs = new Set(filters.attributeStats);
    if (checked) {
      if (newAttrs.size >= 3) {
        newAttrs.delete(Array.from(newAttrs)[0]);
      }
      newAttrs.add(attr);
    } else {
      newAttrs.delete(attr);
    }
    onFilterChange({ ...filters, attributeStats: newAttrs });
  };

  const handleAttributeClear = () => {
    onFilterChange({ ...filters, attributeStats: new Set() });
    setOpenDropdown(null);
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
        onChange={e => {
          onChange(e.target.value);
        }}
        onClick={() => setOpenDropdown(null)}
        onMouseDown={() => setOpenDropdown(null)}
        className="py-1 px-2 sm:px-3 sm:py-2 bg-card border border-border rounded text-xs sm:text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer appearance-none"
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

  const FilterMultiSelect = ({
    label,
    values,
    options,
    onAddValue,
    onRemoveValue,
    onClear,
  }: {
    label: string;
    values: Set<string>;
    options: string[];
    onAddValue: (val: string, checked: boolean) => void;
    onRemoveValue?: (val: string) => void;
    onClear?: () => void;
  }) => {
    const isOpen = openDropdown === label;
    return (
      <div className="relative flex flex-col gap-1">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : label)}
          className="py-1 px-2 sm:px-3 sm:py-2 bg-card border border-border rounded text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center justify-between"
        >
          <span>{values.size === 0 ? 'None' : `${values.size} selected`}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded shadow-lg z-50 min-w-max">
            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              {/* None option */}
              <button
                onClick={onClear}
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted/50 transition-colors text-muted-foreground whitespace-nowrap"
              >
                None
              </button>
              {/* Options */}
              {options.map(option => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50 rounded transition-colors whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={values.has(option)}
                    onChange={e => onAddValue(option, e.target.checked)}
                    className="rounded border-input flex-shrink-0"
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-b border-border bg-card">
      {/* Top Filter Bar - Rarity and Weapon Type */}
      <div className="border-b border-border px-4 py-2 sm:py-4">
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          {/* Rarity Filters */}
          <div className="flex gap-2 items-center flex-wrap">
            {[3, 4, 5, 6].map(rarity => (
              <button
                key={rarity}
                onClick={() =>
                  handleRarityChange(rarity, !filters.rarity.has(rarity))
                }
                className={`px-2 sm:px-3 sm:py-1.5 text-xs font-semibold uppercase rounded border transition-colors ${filters.rarity.has(rarity)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                  }`}
              >
                {rarity} ★
              </button>
            ))}
          </div>

          {/* Weapon Type Filters */}
          {weaponTypes.length > 0 && (
            <div className="flex gap-2 items-center flex-wrap pl-1 sm:pl-4 border-l border-border">
              {weaponTypes.map(type => {
                const { image, label } = getDisplayWeaponType(type, language)
                return (
                  <button
                    key={type}
                    onClick={() =>
                      handleWeaponTypeChange(type, !filters.weaponType.has(type))
                    }
                    className={`flex items-center justify-center gap-1 px-2 sm:px-3 sm:py-1.5 text-xs font-semibold uppercase rounded border transition-colors ${filters.weaponType.has(type)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      }`}
                  >
                    <img src={image} alt={image} className='w-5 h-5' />
                    {label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t('filters.clearAll')}
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Dropdown Filters */}
      <div className="sm:px-4 sm:py-4 flex flex-col sm:gap-4 items-start relative">
        {/* Right Column - Filters */}
        <div className="px-2 sm:px-0 flex flex-wrap gap-1 sm:gap-4 items-end flex-1">
          <FilterMultiSelect
            label={t('filters.attributeStats')}
            values={filters.attributeStats}
            options={attributeStats}
            onAddValue={handleAttributeChange}
            onClear={handleAttributeClear}
          />
          <FilterSelect
            label={t('filters.secondaryStats')}
            value={Array.from(filters.secondaryStats)[0] ?? ''}
            options={secondaryStats}
            onChange={handleSecondaryChange}
          />
          <FilterSelect
            label={t('filters.skillStats')}
            value={Array.from(filters.skillStats)[0] ?? ''}
            options={skillStats}
            onChange={handleSkillChange}
          />
          <FilterSelect
            label={t('filters.domain')}
            value={Array.from(filters.domains)[0] ?? ''}
            options={domains}
            onChange={handleDomainChange}
          />
        </div>
        {/* Left Column - Farming Planner and Include God Roll */}
        <div className="px-2 py-1 sm:px-0 flex gap-3 w-full lg:w-auto">
          {/* Farming Planner Button */}
          <button
            onClick={onToggleFarmingMode}
            className={`hidden sm:block px-4 py-1 sm:py-2 rounded-lg font-medium transition-colors text-sm w-full lg:w-auto ${isFarmingMode
              ? 'bg-orange-600/30 border border-orange-600/50 text-orange-400 hover:bg-orange-600/40'
              : 'bg-secondary/50 border border-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
          >
            {language === 'en' ? 'Farming Planner' : 'Planificador de Esencias'}
            {isFarmingMode && (selectedWeaponsCount ?? 0) > 0 && (
              <span className="ml-2 text-xs bg-orange-600 px-2 py-1 rounded">
                {selectedWeaponsCount}
              </span>
            )}
          </button>

          {/* Include God Roll Weapons */}
          <label className="hidden sm:flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={filters.showMaxedWeapons}
              onChange={(e) =>
                onFilterChange({ ...filters, showMaxedWeapons: e.target.checked })
              }
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-foreground">{t('filters.showMaxed')}</span>
          </label>
        </div>
        {/* Farming Planner Button */}
        <div className='sm:hidden w-full border-t mt-2 p-2 flex flex-col gap-1'>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={filters.showMaxedWeapons}
              onChange={(e) =>
                onFilterChange({ ...filters, showMaxedWeapons: e.target.checked })
              }
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-foreground">{t('filters.showMaxed')}</span>
          </label>

          <button
            onClick={onToggleFarmingMode}
            className={`w-fit px-4 py-1 sm:py-2 rounded-lg font-medium transition-colors text-sm lg:w-auto ${isFarmingMode
              ? 'bg-orange-600/30 border border-orange-600/50 text-orange-400 hover:bg-orange-600/40'
              : 'bg-secondary/50 border border-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
          >
            {language === 'en' ? 'Farming Planner' : 'Planificador de Esencias'}
            {isFarmingMode && (selectedWeaponsCount ?? 0) > 0 && (
              <span className="ml-2 text-xs bg-orange-600 px-2 py-1 rounded">
                {selectedWeaponsCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Farming Planner Section */}
        {isFarmingMode && (selectedWeaponsCount ?? 0) > 0 && (
          <div className="md:hidden w-full mt-4 pt-4 border-t border-border">
            <div className="space-y-3">
              <h3 className="text-foreground font-semibold text-sm">
                {language === 'en' ? 'Selected Weapons' : 'Armas Seleccionadas'} ({selectedWeaponsCount})
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'en'
                  ? 'Open full planner to view farming routes'
                  : 'Abre el planificador completo para ver rutas de granja'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
