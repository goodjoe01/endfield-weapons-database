'use client';

import { Weapon } from '@/lib/types';
import { getMaxedWeapons } from '@/lib/maxed-weapons';
import { useLanguage } from '@/lib/language-context';
import { X } from 'lucide-react';

interface DomainCount {
  domain: string;
  count: number;
  weaponIds: string[];
}

interface FarmingPlannerProps {
  selectedWeapons: Weapon[];
  onRemoveWeapon: (weaponId: string) => void;
  allWeapons: Weapon[];
}

export function FarmingPlanner({ selectedWeapons, onRemoveWeapon, allWeapons }: FarmingPlannerProps) {
  const { language } = useLanguage();
  const maxedWeapons = getMaxedWeapons();

  if (selectedWeapons.length === 0) {
    return (
      <div className="bg-background border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          {language === 'en' 
            ? 'Select weapons to see best farming routes'
            : 'Selecciona armas para ver las mejores rutas de granja'
          }
        </p>
      </div>
    );
  }

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

  const sortedDomains = Array.from(domainMap.values())
    .sort((a, b) => b.count - a.count);

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

  const suggestedDomains = Array.from(suggestedDomainMap.values())
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 bg-background border border-border rounded-lg p-6">
      {/* Selected Weapons */}
      <div>
        <h3 className="text-foreground font-semibold mb-3">
          {language === 'en' ? 'Selected Weapons' : 'Armas Seleccionadas'} ({selectedWeapons.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedWeapons.map(weapon => (
            <div
              key={weapon.id}
              className="flex items-center gap-2 px-3 py-1 bg-orange-600/20 border border-orange-600/50 rounded-lg text-sm"
            >
              <span className="text-foreground">{weapon.name}</span>
              <button
                onClick={() => onRemoveWeapon(weapon.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Best Farming Domains */}
      {sortedDomains.length > 0 && (
        <div>
          <h3 className="text-foreground font-semibold mb-3">
            {language === 'en' ? 'Best Farming Domains' : 'Mejores Dominios de Granja'}
          </h3>
          <div className="space-y-2">
            {sortedDomains.map((domain, index) => (
              <div key={domain.domain} className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-lg border border-secondary">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-semibold min-w-6">{index + 1}.</span>
                  <span className="text-foreground">{domain.domain}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {domain.count} {language === 'en' ? 'weapon' : 'arma'}{domain.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Farming (based on missing Perfect Essence) */}
      {suggestedDomains.length > 0 && suggestedDomains.length < sortedDomains.length && (
        <div className="border-t border-border pt-4">
          <h3 className="text-foreground font-semibold mb-3 text-yellow-400">
            {language === 'en' 
              ? 'Suggested Farming (missing Perfect Essence)' 
              : 'Granja Sugerida (falta Esencia Perfecta)'
            }
          </h3>
          <div className="space-y-2">
            {suggestedDomains.map((domain, index) => (
              <div key={domain.domain} className="flex items-center justify-between px-3 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-semibold min-w-6">{index + 1}.</span>
                  <span className="text-foreground">{domain.domain}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {domain.count} {language === 'en' ? 'weapon' : 'arma'}{domain.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {language === 'en'
              ? '* Based on weapons not marked as Perfect Essence'
              : '* Basado en armas no marcadas como Esencia Perfecta'
            }
          </p>
        </div>
      )}
    </div>
  );
}
