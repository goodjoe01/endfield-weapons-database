'use client';

import { Weapon } from '@/lib/types';
import { getRarityColor, getRarityLabel, getRarityBackgroundColor } from '@/lib/weapons-utils';
import { isWeaponMaxed, toggleWeaponMaxed } from '@/lib/maxed-weapons';
import { WeaponTooltip } from './weapon-tooltip';
import Image from 'next/image';
import { useState } from 'react';

interface WeaponCardProps {
  weapon: Weapon;
  onMaxedChange?: (isMaxed: boolean) => void;
}

export function WeaponCard({ weapon, onMaxedChange }: WeaponCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMaxed, setIsMaxed] = useState(() => isWeaponMaxed(weapon.name));

  const handleToggleMaxed = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWeaponMaxed(weapon.name);
    const newMaxed = !isMaxed;
    setIsMaxed(newMaxed);
    onMaxedChange?.(newMaxed);
  };

  const bgGradient = getRarityBackgroundColor(weapon.rarity);

  return (
    <div className="relative">
      {/* Tooltip */}
      <WeaponTooltip weapon={weapon} isVisible={showTooltip} />

      {/* Card */}
      <div
        className={`relative flex flex-col gap-2 bg-gradient-to-br ${bgGradient} border border-border rounded-lg overflow-visible hover:shadow-xl transition-shadow duration-200 cursor-pointer`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* MAXED Button */}
        <button
          onClick={handleToggleMaxed}
          className={`absolute top-2 right-2 z-20 px-3 py-1 font-bold text-xs uppercase transition-colors ${
            isMaxed
              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
              : 'bg-black/60 text-white hover:bg-black/80'
          }`}
        >
          Maxed
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
        </div>
      </div>
    </div>
  );
}
