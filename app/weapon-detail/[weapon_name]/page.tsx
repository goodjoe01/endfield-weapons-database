'use client';

import { useEffect, useState } from 'react';
import { Weapon } from '@/lib/types';
import { loadWeapons, getRarityLabel, getRarityColor } from '@/lib/weapons-utils';
import { WeaponDetailContent } from '@/components/weapon-detail-content';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface WeaponDetailPageProps {
  params: {
    weapon_name: string;
  };
}

export default function WeaponDetailPage({ params }: WeaponDetailPageProps) {
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeapons()
      .then(weapons => {
        const decodedName = decodeURIComponent(params.weapon_name);
        const found = weapons.find(w => w.id === decodedName);
        if (found) {
          setWeapon(found);
        } else {
          setError('Weapon not found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load weapon');
        setLoading(false);
      });
  }, [params.weapon_name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading weapon...</p>
      </div>
    );
  }

  if (error || !weapon) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error || 'Weapon not found'}</p>
            <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              Back to Database
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Weapons
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{weapon.name}</span>
            {weapon.rarity && <span className="text-foreground ml-auto">★ {weapon.rarity}★</span>}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <WeaponDetailContent weapon={weapon} />
      </div>
    </main>
  );
}
