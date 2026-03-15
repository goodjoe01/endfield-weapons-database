import { Weapon, FilterState } from './types';

export async function loadWeapons(): Promise<Weapon[]> {
  const response = await fetch('/data/weapons.json');
  if (!response.ok) throw new Error('Failed to load weapons');
  const data = await response.json();
  return data.map((weapon: any) => ({
    ...weapon,
    id: weapon.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export function filterWeapons(weapons: Weapon[], filters: FilterState): Weapon[] {
  return weapons.filter(weapon => {
    // Rarity filter
    if (filters.rarity.size > 0 && !filters.rarity.has(weapon.rarity)) {
      return false;
    }

    // Domains filter (Energy Alluvium)
    if (filters.domains.size > 0) {
      const hasMatchingDomain = weapon.domains.some(d => filters.domains.has(d));
      if (!hasMatchingDomain) return false;
    }

    // Attribute stats filter
    if (filters.attributeStats.size > 0 && !filters.attributeStats.has(weapon.attributeStats)) {
      return false;
    }

    // Skill stats filter
    if (filters.skillStats.size > 0 && !filters.skillStats.has(weapon.skillStats)) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const searchableFields = [
        weapon.name,
        weapon.attributeStats,
        weapon.skillStats,
        weapon.description,
        ...weapon.domains,
      ].join(' ').toLowerCase();

      if (!searchableFields.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function getUniqueDomains(weapons: Weapon[]): string[] {
  const domains = new Set<string>();
  weapons.forEach(w => w.domains.forEach(d => domains.add(d)));
  return Array.from(domains).sort();
}

export function getUniqueAttributeStats(weapons: Weapon[]): string[] {
  const stats = new Set<string>();
  weapons.forEach(w => stats.add(w.attributeStats));
  return Array.from(stats).sort();
}

export function getUniqueSkillStats(weapons: Weapon[]): string[] {
  const stats = new Set<string>();
  weapons.forEach(w => stats.add(w.skillStats));
  return Array.from(stats).sort();
}

export function getRarityColor(rarity: number): string {
  switch (rarity) {
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-purple-500';
    case 5:
      return 'bg-orange-500';
    case 6:
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

export function getRarityLabel(rarity: number): string {
  return `${rarity}-Star`;
}
