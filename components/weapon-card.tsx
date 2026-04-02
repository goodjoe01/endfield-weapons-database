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
  isFarmingMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (weapon: Weapon) => void;
}

export function WeaponCard({ weapon, onMaxedChange, isFarmingMode, isSelected, onToggleSelect }: WeaponCardProps) {
  const { t, language } = useLanguage();
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
        {/* Card - Wrapped in Link only when NOT in Farming Mode */}
        {isFarmingMode ? (
          <div
            onClick={() => onToggleSelect?.(weapon)}
            className={`relative flex flex-col bg-linear-to-br ${bgGradient} border rounded-t-lg overflow-visible transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'border-4 border-amber-500 shadow-lg shadow-amber-500/40 bg-opacity-100'
                : 'border border-border bg-opacity-40 hover:bg-opacity-50'
            }`}
          >
            {/* Image Container */}
            <div className="relative w-full h-40 bg-black/40 overflow-hidden">
              {!imageError ? (
                <Image
                  src={weapon.image ?? ''}
                  alt={weapon.name}
                  fill
                  className="relative z-1 object-cover"
                  loading="eager"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}

              {/* Weapon Type Badge */}
              <img
                className='absolute z-2 top-1 left-1 w-7 h-7 bg-black/50 rounded-sm'
                src={getDisplayWeaponType(weapon.weaponType ?? '', language).image}
                alt={getDisplayWeaponType(weapon.weaponType ?? '', language).image} />

              {/* Rarity Badge */}
              <div className={`text-xs absolute bottom-0 right-2 inline-flex w-fit px-1 ${getRarityColor(weapon.rarity)} text-white text-xs font-semibold rounded mb-2`}>
                {getRarityLabel(weapon.rarity)}
              </div>

              {/* Farming Mode Checkbox */}
              {isFarmingMode && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-black/50 rounded border-2 border-orange-400 pointer-events-none"
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-2 py-1 flex flex-col justify-between">
              {/* Name */}
              <h3 className="font-semibold text-foreground truncate text-sm flex-1 line-clamp-2">{weapon.name}</h3>
            </div>
          </div>
        ) : (
          <Link href={`/weapon-detail/${weapon.id}`} className="block">
            <div
              className={`relative flex flex-col bg-linear-to-br ${bgGradient} border rounded-t-lg overflow-visible transition-all duration-200 cursor-pointer border border-border bg-opacity-40 hover:shadow-xl hover:bg-opacity-80`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {/* Image Container */}
              <div className="relative w-full h-40 bg-black/40 overflow-hidden">
                {!imageError ? (
                  <Image
                    src={weapon.image ?? ''}
                    alt={weapon.name}
                    fill
                    className="relative z-1 object-cover"
                    loading="eager"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No image
                  </div>
                )}

                {/* Weapon Type Badge */}
                <img
                  className='absolute z-2 top-1 left-1 w-7 h-7 bg-black/50 rounded-sm'
                  src={getDisplayWeaponType(weapon.weaponType ?? '', language).image}
                  alt={getDisplayWeaponType(weapon.weaponType ?? '', language).image} />

                {/* Rarity Badge */}
                <div className={`text-xs absolute bottom-0 right-2 inline-flex w-fit px-1 ${getRarityColor(weapon.rarity)} text-white text-xs font-semibold rounded mb-2`}>
                  {getRarityLabel(weapon.rarity)}
                </div>
              </div>

              {/* Content */}
              <div className="px-2 py-1 flex flex-col justify-between">
                {/* Name */}
                <h3 className="font-semibold text-foreground text-center truncate text-sm flex-1 line-clamp-2">{weapon.name}</h3>
              </div>
            </div>
          </Link>
        )}

        {/* MAXED Button - Outside Link, at bottom */}
        <button
          onClick={handleToggleMaxed}
          title={t('filters.perfectEssence.description')}
          className={`w-full py-1 text-xs font-bold uppercase transition-colors rounded-b-lg border border-t-0 border-border ${isMaxed
            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
            : 'bg-gray-500/60 text-gray-400 hover:bg-gray-700/80 hover:text-gray-300'
            }`}
        >
          {t('filters.perfectEssence.text')}
        </button>
      </div>
    </div>
  );
}
