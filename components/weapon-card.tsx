'use client';

import { Weapon } from '@/lib/types';
import { getRarityColor, getRarityLabel, getRarityBackgroundColor } from '@/lib/weapons-utils';
import { isWeaponMaxed, toggleWeaponMaxed } from '@/lib/maxed-weapons';
import Image from 'next/image';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface WeaponCardProps {
  weapon: Weapon;
}

export function WeaponCard({ weapon }: WeaponCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMaxed, setIsMaxed] = useState(() => isWeaponMaxed(weapon.name));

  const handleToggleMaxed = () => {
    toggleWeaponMaxed(weapon.name);
    setIsMaxed(!isMaxed);
  };

  const bgGradient = getRarityBackgroundColor(weapon.rarity);

  return (
    <div className={`relative flex flex-col gap-2 bg-gradient-to-br ${bgGradient} border border-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200`}>
      {/* Maxed Badge */}
      <button
        onClick={handleToggleMaxed}
        className="absolute top-2 right-2 z-20 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
        title={isMaxed ? 'Remove maxed' : 'Mark as maxed'}
      >
        <Check className={`h-4 w-4 ${isMaxed ? 'text-green-400' : 'text-gray-400'}`} />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-40 bg-black/40 overflow-hidden">
        {!imageError ? (
          <Image
            src={weapon.image}
            alt={weapon.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        {/* Rarity Badge */}
        <div className={`inline-flex w-fit px-2 py-1 ${getRarityColor(weapon.rarity)} text-white text-xs font-semibold rounded mb-2`}>
          {getRarityLabel(weapon.rarity)}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground truncate mb-2 text-sm">{weapon.name}</h3>

        {/* Hover Tooltip */}
        {showTooltip && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-lg p-3 z-30 flex flex-col gap-2 text-xs text-foreground">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <div>
              <span className="font-semibold text-yellow-400">Stats:</span>
              <p className="text-muted-foreground">{weapon.attributeStats}</p>
            </div>
            <div>
              <span className="font-semibold text-yellow-400">Secondary:</span>
              <p className="text-muted-foreground">{weapon.secondaryStats}</p>
            </div>
            <div>
              <span className="font-semibold text-yellow-400">Skill:</span>
              <p className="text-muted-foreground">{weapon.skillStats}</p>
            </div>
            {weapon.description && (
              <div>
                <span className="font-semibold text-yellow-400">Description:</span>
                <p className="text-muted-foreground line-clamp-4">{weapon.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Hover Trigger Zone */}
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="h-12 cursor-pointer flex items-center justify-center text-xs text-muted-foreground bg-black/20 rounded hover:bg-black/40 transition-colors"
        >
          {showTooltip ? 'Viewing details...' : 'Hover for details'}
        </div>
      </div>
    </div>
  );
}
