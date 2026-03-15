'use client';

import { useState } from 'react';
import { FilterState, Weapon } from '@/lib/types';
import {
  getUniqueDomains,
  getUniqueAttributeStats,
  getUniqueSkillStats,
  getUniqueWeaponTypes,
} from '@/lib/weapons-utils';
import { ChevronDown } from 'lucide-react';

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
  const skillStats = getUniqueSkillStats(weapons).filter(s => s && s.trim());
  const weaponTypes = getUniqueWeaponTypes(weapons);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
      weaponType: new Set(),
      domains: new Set(),
      attributeStats: new Set(),
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
    filters.skillStats.size > 0;

  const ExpandableSection = ({
    title,
    sectionId,
    children,
  }: {
    title: string;
    sectionId: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSection === sectionId;
    return (
      <div className="border-b border-border last:border-b-0">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isExpanded && <div className="px-4 pb-3 space-y-2 flex flex-col">{children}</div>}
      </div>
    );
  };

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

      {/* Toggle for Mobile */}
      <div className="px-4 py-3 flex items-center justify-between lg:hidden">
        <button
          onClick={() => onToggle(!isOpen)}
          className="text-sm font-medium text-foreground hover:text-primary"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Vertical Expandable Filters */}
      {isOpen && (
        <div className="border-t border-border">
          {/* Energy Alluvium (Domains) Filter */}
          <ExpandableSection title="Energy Alluvium" sectionId="domains">
            {domains.map(domain => (
              <label
                key={domain}
                className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.domains.has(domain)}
                  onChange={e => handleDomainChange(domain, e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm text-muted-foreground truncate">{domain}</span>
              </label>
            ))}
          </ExpandableSection>

          {/* Attribute Stats Filter */}
          <ExpandableSection title="Attribute Stats" sectionId="attributeStats">
            {attributeStats.map(attr => (
              <label
                key={attr}
                className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.attributeStats.has(attr)}
                  onChange={e => handleAttributeChange(attr, e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm text-muted-foreground truncate">{attr}</span>
              </label>
            ))}
          </ExpandableSection>

          {/* Skill Stats Filter */}
          <ExpandableSection title="Skill Stats" sectionId="skillStats">
            {skillStats.map(skill => (
              <label
                key={skill}
                className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.skillStats.has(skill)}
                  onChange={e => handleSkillChange(skill, e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm text-muted-foreground truncate">{skill}</span>
              </label>
            ))}
          </ExpandableSection>

          {/* Show Maxed Weapons */}
          <div className="border-b border-border px-4 py-3">
            <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={filters.showMaxedWeapons}
                onChange={e =>
                  onFilterChange({ ...filters, showMaxedWeapons: e.target.checked })
                }
                className="rounded border-input"
              />
              <span className="text-sm text-muted-foreground">Show maxed weapons</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
