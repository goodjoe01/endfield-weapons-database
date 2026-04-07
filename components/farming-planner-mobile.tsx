'use client';

import { useState } from 'react';
import { Weapon } from '@/lib/types';
import { getMaxedWeapons } from '@/lib/maxed-weapons';
import { useLanguage } from '@/lib/language-context';
import { X, Pin } from 'lucide-react';

interface DomainCount {
  domain: string;
  count: number;
  weaponIds: string[];
}

interface FarmingPlannerMobileProps {
  selectedWeapons: Weapon[];
  onRemoveWeapon: (weaponId: string) => void;
  onClearAll: () => void;
}

export function FarmingPlannerMobile({ selectedWeapons, onRemoveWeapon, onClearAll }: FarmingPlannerMobileProps) {
  const { language } = useLanguage();
  const [isPinned, setIsPinned] = useState(false);
  const maxedWeapons = getMaxedWeapons();

  // Calculate domain efficiency
  const domainMap = new Map<string, DomainCount>();
  selectedWeapons.forEach(weapon => {
    if (weapon.domains && weapon.domains.length > 0) {
      weapon.domains.forEach(domain => {
        if (!domainMap.has(domain)) {
          domainMap.set(domain, { domain, count: 0, weaponIds: [] });
        }
        const entry = domainMap.get(domain)!;
        entry.count++;
        entry.weaponIds.push(weapon.id);
      });
    }
  });

  const sortedDomains = Array.from(domainMap.values()).sort((a, b) => b.count - a.count);

  // Calculate suggested domains (for weapons without Perfect Essence)
  const notMaxedWeapons = selectedWeapons.filter(w => !maxedWeapons.has(w.name));
  const suggestedDomainMap = new Map<string, DomainCount>();
  
  notMaxedWeapons.forEach(weapon => {
    if (weapon.domains && weapon.domains.length > 0) {
      weapon.domains.forEach(domain => {
        if (!suggestedDomainMap.has(domain)) {
          suggestedDomainMap.set(domain, { domain, count: 0, weaponIds: [] });
        }
        const entry = suggestedDomainMap.get(domain)!;
        entry.count++;
        entry.weaponIds.push(weapon.id);
      });
    }
  });

  const suggestedDomains = Array.from(suggestedDomainMap.values()).sort((a, b) => b.count - a.count);

  if (selectedWeapons.length === 0) {
    return null;
  }

  return (
    <div className={`md:hidden w-full border-t border-border ${isPinned ? 'fixed bottom-0 left-0 right-0 bg-background border-t-2 border-orange-600/50 z-40 h-[50vh] overflow-hidden flex flex-col' : 'mt-6 pt-6'}`}>
      {/* Header - Always visible */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-border">
        <h3 className="text-foreground font-semibold text-sm">
          {language === 'en' ? 'Selected Weapons' : 'Armas Seleccionadas'} ({selectedWeapons.length})
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded transition-colors ${isPinned ? 'bg-orange-600/30 text-orange-400' : 'text-muted-foreground hover:text-foreground'}`}
            title={isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="h-4 w-4" />
          </button>
          <button
            onClick={onClearAll}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium px-2 py-1"
          >
            {language === 'en' ? 'Clear' : 'Limpiar'}
          </button>
        </div>
      </div>

      {/* Content Container - Scrollable */}
      <div className={`flex-1 overflow-y-auto ${isPinned ? '' : 'px-4'}`}>
        <div className={`${isPinned ? 'px-4' : ''}`}>
          {/* Selected Weapons Chips */}
          <div className="flex flex-wrap gap-1.5 py-2">
            {selectedWeapons.map(weapon => (
              <div
                key={weapon.id}
                className="flex items-center gap-1.5 px-2 py-1 bg-orange-600/20 border border-orange-600/50 rounded text-xs"
              >
                <span className="text-foreground truncate">{weapon.name}</span>
                <button
                  onClick={() => onRemoveWeapon(weapon.id)}
                  className="text-muted-foreground hover:text-orange-400 transition-colors flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Best Farming Domains */}
          {sortedDomains.length > 0 && (
            <div className="py-2">
              <h4 className="text-foreground font-semibold text-xs mb-1.5">
                {language === 'en' ? 'Best Farming Routes' : 'Mejores Rutas'}
              </h4>
              <div className="space-y-1">
                {sortedDomains.map((domain, index) => (
                  <div key={domain.domain} className="flex items-center justify-between px-2 py-1 bg-secondary/50 rounded border border-secondary text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-semibold">{index + 1}.</span>
                      <span className="text-foreground truncate">{domain.domain}</span>
                    </div>
                    <span className="text-muted-foreground flex-shrink-0">
                      ×{domain.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Farming */}
          {suggestedDomains.length > 0 && suggestedDomains.length < sortedDomains.length && (
            <div className="border-t border-border py-2">
              <h4 className="text-foreground font-semibold text-xs mb-1.5 text-yellow-400">
                {language === 'en' ? 'Perfect Essence Needed' : 'Esencia Perfecta'}
              </h4>
              <div className="space-y-1">
                {suggestedDomains.map((domain, index) => (
                  <div key={domain.domain} className="flex items-center justify-between px-2 py-1 bg-yellow-600/20 border border-yellow-600/50 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-semibold">{index + 1}.</span>
                      <span className="text-foreground truncate">{domain.domain}</span>
                    </div>
                    <span className="text-muted-foreground flex-shrink-0">
                      ×{domain.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
