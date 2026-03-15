'use client';

import { useState } from 'react';
import { FilterState, Weapon } from '@/lib/types';
import {
  getUniqueDomains,
  getUniqueAttributeStats,
  getUniqueSkillStats,
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
      showMaxedWeapons: false,
    });
  };

  const hasActiveFilters =
    filters.rarity.size > 0 ||
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
        {isExpanded && <div className="px-4 pb-3 space-y-2">{children}</div>}
      </div>
    );
  };

  return (
    <div className="border-b border-border bg-card">
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
        <div className="border-t border-border lg:border-t-0">
          {/* Rarity Filter */}
          <ExpandableSection title="Rarity" sectionId="rarity">
            <div className="space-y-2">
              {[3, 4, 5, 6].map(rarity => (
                <label
                  key={rarity}
                  className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
                >
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
          </ExpandableSection>

          {/* Energy Alluvium (Domains) Filter */}
          <ExpandableSection title="Energy Alluvium" sectionId="domains">
            <div className="space-y-2 max-h-48 overflow-y-auto">
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
            </div>
          </ExpandableSection>

          {/* Attribute Stats Filter */}
          <ExpandableSection title="Attribute Stats" sectionId="attributeStats">
            <div className="space-y-2 max-h-48 overflow-y-auto">
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
            </div>
          </ExpandableSection>

          {/* Skill Stats Filter */}
          <ExpandableSection title="Skill Stats" sectionId="skillStats">
            <div className="space-y-2 max-h-48 overflow-y-auto">
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
            </div>
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
