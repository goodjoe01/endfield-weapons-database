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
  isOpen: boolean;
  onClose: () => void;
}

export function FarmingPlanner({ selectedWeapons, onRemoveWeapon, allWeapons, isOpen, onClose }: FarmingPlannerProps) {
  const { language } = useLanguage();
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

  const renderContent = () => (
    <>
      {selectedWeapons.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Select weapons to see best farming routes'
              : 'Selecciona armas para ver las mejores rutas de granja'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Selected Weapons */}
          <div>
            <h3 className="text-foreground font-semibold mb-3">
              {language === 'en' ? 'Selected Weapons' : 'Armas Seleccionadas'}
            </h3>
            <div className="space-y-2">
              {selectedWeapons.map(weapon => (
                <div
                  key={weapon.id}
                  className="flex items-center justify-between px-3 py-2 bg-orange-600/20 border border-orange-600/50 rounded-lg"
                >
                  <span className="text-foreground text-sm truncate">{weapon.name}</span>
                  <button
                    onClick={() => onRemoveWeapon(weapon.id)}
                    className="text-muted-foreground hover:text-orange-400 transition-colors flex-shrink-0 ml-2"
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
                {language === 'en' ? 'Best Farming Routes' : 'Mejores Rutas de Granja'}
              </h3>
              <div className="space-y-2">
                {sortedDomains.map((domain, index) => (
                  <div key={domain.domain} className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-lg border border-secondary">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 font-semibold w-6">{index + 1}.</span>
                      <span className="text-foreground text-sm truncate">{domain.domain}</span>
                    </div>
                    <span className="text-muted-foreground text-xs flex-shrink-0 ml-2">
                      ×{domain.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Farming (based on missing Perfect Essence) */}
          {suggestedDomains.length > 0 && suggestedDomains.length < sortedDomains.length && (
            <div className="border-t border-border pt-4">
              <h3 className="text-foreground font-semibold mb-3 text-yellow-400 text-sm">
                {language === 'en' 
                  ? 'Need Perfect Essence' 
                  : 'Necesita Esencia Perfecta'
                }
              </h3>
              <div className="space-y-2">
                {suggestedDomains.map((domain, index) => (
                  <div key={domain.domain} className="flex items-center justify-between px-3 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 font-semibold w-6">{index + 1}.</span>
                      <span className="text-foreground text-sm truncate">{domain.domain}</span>
                    </div>
                    <span className="text-muted-foreground text-xs flex-shrink-0 ml-2">
                      ×{domain.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {language === 'en'
                  ? 'Showing weapons not marked as Perfect Essence'
                  : 'Mostrando armas no marcadas como Esencia Perfecta'
                }
              </p>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      {/* Side Panel - Desktop */}
      <div
        className={`hidden md:block fixed right-0 top-0 h-screen w-full max-w-md bg-background border-l-2 border-orange-600/50 overflow-y-auto transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-orange-600/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {language === 'en' ? 'Farming Planner' : 'Planificador de Granja'}
          </h2>
          <span className="text-sm bg-orange-600/30 px-2 py-1 rounded text-orange-400 font-semibold">
            {selectedWeapons.length}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 pb-24">
          {renderContent()}
        </div>

        {/* Footer with Clear Button */}
        {selectedWeapons.length > 0 && (
          <div className="fixed bottom-0 right-0 hidden md:block w-full max-w-md bg-background border-t border-orange-600/50 px-6 py-4">
            <button
              onClick={() => {
                selectedWeapons.forEach(w => onRemoveWeapon(w.id));
              }}
              className="w-full px-4 py-2 bg-red-600/30 border border-red-600/50 text-red-400 hover:bg-red-600/40 rounded-lg font-medium transition-colors text-sm"
            >
              {language === 'en' ? 'Clear Selection' : 'Limpiar Selección'}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer - Bottom Sheet */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t-2 border-orange-600/50 rounded-t-2xl max-h-[80vh] overflow-y-auto transition-transform duration-300 z-50">
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-orange-600/50 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-foreground">
                {language === 'en' ? 'Farming Planner' : 'Planificador de Granja'}
              </h2>
              <span className="text-sm bg-orange-600/30 px-2 py-1 rounded text-orange-400 font-semibold">
                {selectedWeapons.length}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 pb-32">
              {renderContent()}
            </div>

            {/* Footer with Clear Button */}
            {selectedWeapons.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-orange-600/50 px-6 py-4">
                <button
                  onClick={() => {
                    selectedWeapons.forEach(w => onRemoveWeapon(w.id));
                  }}
                  className="w-full px-4 py-2 bg-red-600/30 border border-red-600/50 text-red-400 hover:bg-red-600/40 rounded-lg font-medium transition-colors text-sm"
                >
                  {language === 'en' ? 'Clear Selection' : 'Limpiar Selección'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
