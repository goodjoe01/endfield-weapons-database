'use client';

import { Weapon } from '@/lib/types';
import { getDisplayWeaponType } from '@/lib/weapons-utils';
import { useLanguage } from '@/lib/language-context';

interface WeaponTooltipProps {
  weapon: Weapon;
  isVisible: boolean;
}

export function WeaponTooltip({ weapon, isVisible }: WeaponTooltipProps) {
  const { language } = useLanguage();
  if (!isVisible) return null;

  // Parse stats from the attributeStats and secondaryStats strings
  const parseStatValue = (stat: string) => {
    const match = stat.match(/([^+\-\d]*)([\+\-]\d+\.?\d*%?)/);
    if (match) {
      return { label: match[1].trim(), value: match[2] };
    }
    return { label: stat, value: '' };
  };

  const primaryStat = parseStatValue(weapon.attributeStats);
  const secondaryStat = parseStatValue(weapon.secondaryStats);
  const { label, image } = getDisplayWeaponType(weapon.weaponType ?? '', language);

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none">
      <div className="bg-gray-900 border-2 border-orange-600 rounded-lg px-4 pt-2 pb-3 w-112.5 shadow-2xl">
        {/* Weapon Name */}
        <div className="mb-2 pb-2 border-b border-orange-600/50">
          <p className="text-white font-bold text-base">{weapon.name}</p>
          <p className="text-orange-400 font-semibold text-sm flex items-center gap-1">
            <img src={image} alt={label} className="w-5 h-5" />
            {label}
          </p>
        </div>

        {/* Stats Section */}
        <div className="border-b border-orange-600/50 pb-2 mb-2">
          <h4 className="text-orange-600 font-bold text-sm">STATS</h4>
          <div className="flex gap-6 font-medium">
            <div className="flex justify-between text-white text-sm">
              <span>{primaryStat.label}</span>
              <span className="text-orange-400 font-semibold">{primaryStat.value}</span>
            </div>
            <div className="flex justify-between text-white text-sm">
              <span>{secondaryStat.label}</span>
              <span className="text-orange-400 font-semibold">{secondaryStat.value}</span>
            </div>
          </div>
        </div>

        {/* Passive Attribute Section */}
        <div className="mb-2">
          <h5 className="text-gray-400 font-bold text-xs uppercase">Passive Attribute</h5>
          <div>
            <p className="text-yellow-400 font-bold text-sm">{weapon.skillStats}</p>
            <p className="text-white text-xs leading-relaxed">
              {weapon.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Domains Section */}
        {weapon.domains && weapon.domains.length > 0 && (
          <div className="border-t border-orange-600/50 pt-2">
            <h5 className="text-gray-400 font-bold text-xs mb-1 uppercase">Available in</h5>
            <div className="flex flex-wrap gap-2">
              {weapon.domains.map(domain => (
                <span key={domain} className="px-1 bg-orange-600/30 text-orange-300 rounded text-xs">
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tooltip Arrow */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-orange-600"></div>
    </div>
  );
}
