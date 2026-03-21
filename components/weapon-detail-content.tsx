'use client';

import { useState } from 'react';
import { Weapon } from '@/lib/types';
import { getRarityLabel, getRarityColor, getDisplayWeaponType } from '@/lib/weapons-utils';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface WeaponDetailContentProps {
  weapon: Weapon;
}

export function WeaponDetailContent({ weapon }: WeaponDetailContentProps) {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleLike = () => {
    if (liked === true) {
      setLikes(l => l - 1);
      setLiked(null);
    } else {
      if (liked === false) setDislikes(d => d - 1);
      setLikes(l => l + 1);
      setLiked(true);
    }
  };

  const handleDislike = () => {
    if (liked === false) {
      setDislikes(d => d - 1);
      setLiked(null);
    } else {
      if (liked === true) setLikes(l => l - 1);
      setDislikes(d => d + 1);
      setLiked(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Image */}
      <div className="lg:col-span-1">
        <div className="relative w-full aspect-square bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg overflow-hidden">
          {!imageError ? (
            <Image
              src={weapon.imageCloud || weapon.image}
              alt={weapon.name}
              fill
              className="object-cover"
              loading="eager"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title and Actions */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{weapon.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors ${
                liked === true
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors ${
                liked === false
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{dislikes}</span>
            </button>
            <button className="ml-auto px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300 transition-colors">
              Create Build
            </button>
          </div>
        </div>

        {/* Basic Stats */}
        <div className="space-y-2 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-semibold">Rarity:</span>
            <span className={`inline-flex px-2 py-1 ${getRarityColor(weapon.rarity)} text-white text-xs font-semibold rounded`}>
              {getRarityLabel(weapon.rarity)}
            </span>
          </div>
          <div>
            <span className="text-foreground font-semibold">Weapon Type:</span>
            <span className="text-muted-foreground ml-2">{weapon.weaponType ? getDisplayWeaponType(weapon.weaponType, language) : 'N/A'}</span>
          </div>
          <div>
            <span className="text-foreground font-semibold">Max Level:</span>
            <span className="text-muted-foreground ml-2">90</span>
          </div>
          <div>
            <span className="text-foreground font-semibold">Attack (Lv.90):</span>
            <span className="text-yellow-400 ml-2 font-semibold">485</span>
          </div>
        </div>

        {/* Effects - Attribute and Secondary Stats */}
        <div className="space-y-4 border-t border-border pt-4">
          {/* Passive Attribute */}
          <div>
            <h3 className="text-foreground font-semibold mb-2">Passive Attribute</h3>
            <p className="text-muted-foreground text-sm">{weapon.attributeStats}</p>
          </div>

          {/* Secondary Attribute */}
          {weapon.secondaryStats && (
            <div>
              <h3 className="text-foreground font-semibold mb-2">Secondary Attribute</h3>
              <p className="text-muted-foreground text-sm">{weapon.secondaryStats}</p>
            </div>
          )}
        </div>

        {/* Skill Description */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-yellow-400 font-semibold">{weapon.skillStats}</h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{weapon.description}</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            {weapon.domains.length > 0 && (
              <div>
                <span className="text-foreground font-semibold">Obtainable from:</span>
                <div className="flex gap-2 mt-1">
                  {weapon.domains.map(domain => (
                    <span key={domain} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
