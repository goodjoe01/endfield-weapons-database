'use client';

import { Weapon } from '@/lib/types';
import { getRarityLabel } from '@/lib/weapons-utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
        <WeaponListItem key={weapon.id} weapon={weapon} />
      ))}
    </div>
  );
}

function WeaponListItem({ weapon }: { weapon: Weapon }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/weapon-detail/${weapon.id}`}>
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
        {/* Image Column */}
        <div className="flex-shrink-0 w-16 h-16 bg-black/40 rounded overflow-hidden">
          {!imageError ? (
            <Image
              src={weapon.image}
              alt={weapon.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No img
            </div>
          )}
        </div>

        {/* Content */}
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

        {/* Domains */}
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
    </Link>
  );
}
