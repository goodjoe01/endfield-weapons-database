'use client';

import { Weapon } from '@/lib/types';
import { getRarityLabel } from '@/lib/weapons-utils';

interface WeaponListProps {
  weapons: Weapon[];
}

export function WeaponList({ weapons }: WeaponListProps) {
  if (weapons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No weapons found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {weapons.map(weapon => (
        <div
          key={weapon.id}
          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{weapon.name}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground">{getRarityLabel(weapon.rarity)}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{weapon.attributeStats}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{weapon.skillStats}</span>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="flex gap-1">
              {weapon.domains.slice(0, 2).map(domain => (
                <span
                  key={domain}
                  className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded whitespace-nowrap"
                >
                  {domain}
                </span>
              ))}
              {weapon.domains.length > 2 && (
                <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                  +{weapon.domains.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
