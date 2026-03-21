'use client';

import { Weapon } from '@/lib/types';
import { getRarityColor, getRarityLabel, getRarityBackgroundColor, getDisplayWeaponType } from '@/lib/weapons-utils';
import { useLanguage } from '@/lib/language-context';
import { isWeaponMaxed, toggleWeaponMaxed } from '@/lib/maxed-weapons';
import { WeaponTooltip } from './weapon-tooltip';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface WeaponCardProps {
  weapon: Weapon;
  onMaxedChange?: (isMaxed: boolean) => void;
}

export function WeaponCard({ weapon, onMaxedChange }: WeaponCardProps) {
  const { language } = useLanguage();
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
      {/* Tooltip - Only on desktop (lg and above) */}
      <div className="hidden lg:block">
        <WeaponTooltip weapon={weapon} isVisible={showTooltip} />
      </div>

      {/* Card Container */}
      <div className="flex flex-col gap-0">
        {/* Card - Wrapped in Link */}
        <Link href={`/weapon-detail/${weapon.id}`} className="block">
          <div
            className={`relative flex flex-col gap-2 bg-gradient-to-br ${bgGradient} border border-border rounded-t-lg overflow-visible hover:shadow-xl transition-shadow duration-200 cursor-pointer`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Image Container */}
            <div className="relative w-full h-40 bg-black/40 overflow-hidden">
              {!imageError ? (
                <Image
                  src={weapon.image?? ''}
                  alt={weapon.name}
                  fill
                  className="object-cover"
                  loading="eager"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-3 pb-3 flex flex-col h-24">
              {/* Weapon Type Badge */}
              <div className="text-xs text-gray-100 mb-1 truncate">{getDisplayWeaponType(weapon.weaponType ?? '')}</div>

              {/* Rarity Badge */}
              <div className={`inline-flex w-fit px-2 py-1 ${getRarityColor(weapon.rarity)} text-white text-xs font-semibold rounded mb-2`}>
                {getRarityLabel(weapon.rarity)}
              </div>

              {/* Name */}
              <h3 className="font-semibold text-foreground truncate text-sm flex-1 line-clamp-2">{weapon.name}</h3>
            </div>
          </div>
        </Link>

        {/* MAXED Button - Outside Link, at bottom */}
        <button
          onClick={handleToggleMaxed}
          className={`w-full py-2 font-bold text-xs uppercase transition-colors rounded-b-lg border border-t-0 border-border ${
            isMaxed
              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
              : 'bg-gray-700/60 text-gray-300 hover:bg-gray-700/80'
          }`}
        >
          Maxed
        </button>
      </div>
    </div>
  );
}
