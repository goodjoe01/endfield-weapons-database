'use client';

import { Weapon } from '@/lib/types';
import { getRarityColor, getRarityLabel } from '@/lib/weapons-utils';
import Image from 'next/image';
import { useState } from 'react';

interface WeaponCardProps {
  weapon: Weapon;
}

export function WeaponCard({ weapon }: WeaponCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
        {!imageError ? (
          <Image
            src={weapon.image}
            alt={weapon.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Rarity Badge */}
      <div className={`inline-flex w-fit px-2 py-1 ${getRarityColor(weapon.rarity)} text-white text-xs font-semibold rounded`}>
        {getRarityLabel(weapon.rarity)}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-foreground truncate">{weapon.name}</h3>

      {/* Stats */}
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Attribute:</span> {weapon.attributeStats}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Skill:</span> {weapon.skillStats}
        </p>
      </div>

      {/* Domains */}
      {weapon.domains.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {weapon.domains.map(domain => (
            <span
              key={domain}
              className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
            >
              {domain}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {weapon.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{weapon.description}</p>
      )}
    </div>
  );
}
