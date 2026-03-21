import { Weapon, FilterState } from './types';

const WEAPON_TYPE_DISPLAY_NAMES: Record<string, Record<string, string>> = {
  'en': {
    'Caster': 'Arts Unit',
    'Pistol': 'Handcannon',
    'Lance': 'Polearm',
    'lance': 'Polearm',
    'Sword': 'Sword',
    'Greatsword': 'Great Sword',
    'funnel': 'Arts Unit',
  },
  'es': {
    'Caster': 'Unidad de las Artes',
    'Pistol': 'Cañón de mano',
    'Lance': 'Arma de asta',
    'lance': 'Arma de asta',
    'Sword': 'Espada',
    'Greatsword': 'Gran espada',
    'funnel': 'Unidad de las Artes',
  },
};

export function getDisplayWeaponType(weaponType: string, language: string = 'en'): string {
  return WEAPON_TYPE_DISPLAY_NAMES[language]?.[weaponType] || 
         WEAPON_TYPE_DISPLAY_NAMES['en'][weaponType] || 
         weaponType;
}

export async function loadWeapons(language: string = 'en'): Promise<Weapon[]> {
  // Always load English as base for IDs and non-translatable fields
  const enResponse = await fetch('/data/weapons.json');
  if (!enResponse.ok) throw new Error('Failed to load weapons');
  const enData = await enResponse.json();

  // If English, return normalized
  if (language === 'en') {
    return enData.map((weapon: any) => ({
      ...weapon,
      rarity: typeof weapon.rarity === 'string' ? parseInt(weapon.rarity, 10) : weapon.rarity,
      id: weapon.id || weapon.name.toLowerCase().replace(/\s+/g, '-'),
      weaponType: weapon.weaponType, // Keep only weaponType
    }));
  }

  // Load language-specific data
  let langData = enData;
  if (language === 'es') {
    const esResponse = await fetch('/data/weapons.es.json');
    if (esResponse.ok) {
      langData = await esResponse.json();
    }
  }

  // Merge data using image (local path) as the unique key for matching
  const weaponsMap = new Map<string, any>();
  
  // Create map of English weapons using image as key
  enData.forEach((weapon: any) => {
    const id = weapon.id || weapon.name.toLowerCase().replace(/\s+/g, '-');
    const imageKey = weapon.image; // Use local image path as key
    
    if (imageKey) {
      weaponsMap.set(imageKey, {
        ...weapon,
        id,
        weaponType: weapon.weaponType, // Keep only weaponType
        rarity: typeof weapon.rarity === 'string' ? parseInt(weapon.rarity, 10) : weapon.rarity,
      });
    }
  });

  // Overlay language-specific translations using image as key
  if (language === 'es' && langData !== enData) {
    langData.forEach((langWeapon: any) => {
      const imageKey = langWeapon.image;
      
      if (imageKey && weaponsMap.has(imageKey)) {
        const matchedEntry = weaponsMap.get(imageKey)!;
        
        // Apply translations while preserving English data for non-translatable fields
        matchedEntry.name = langWeapon.name || matchedEntry.name;
        matchedEntry.domains = langWeapon.domains || matchedEntry.domains;
        matchedEntry.attributeStats = langWeapon.attributeStats || matchedEntry.attributeStats;
        matchedEntry.secondaryStats = langWeapon.secondaryStats || matchedEntry.secondaryStats;
        matchedEntry.skillStats = langWeapon.skillStats || matchedEntry.skillStats;
        matchedEntry.weaponType = langWeapon.weaponType || matchedEntry.weaponType;
      }
    });
  }

  return Array.from(weaponsMap.values());
}

export function filterWeapons(weapons: Weapon[], filters: FilterState): Weapon[] {
  return weapons.filter(weapon => {
    // Rarity filter
    if (filters.rarity.size > 0 && !filters.rarity.has(weapon.rarity)) {
      return false;
    }

    // Weapon type filter
    if (filters.weaponType.size > 0) {
      if (!weapon.weaponType || !filters.weaponType.has(weapon.weaponType)) {
        return false;
      }
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

    // Secondary stats filter
    if (filters.secondaryStats.size > 0 && !filters.secondaryStats.has(weapon.secondaryStats)) {
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
        weapon.weaponType,
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

export function getUniqueSecondaryStats(weapons: Weapon[]): string[] {
  const stats = new Set<string>();
  weapons.forEach(w => {
    if (w.secondaryStats && w.secondaryStats.trim()) {
      stats.add(w.secondaryStats);
    }
  });
  return Array.from(stats).sort();
}

export function getUniqueSkillStats(weapons: Weapon[]): string[] {
  const stats = new Set<string>();
  weapons.forEach(w => stats.add(w.skillStats));
  return Array.from(stats).sort();
}

export function getUniqueWeaponTypes(weapons: Weapon[]): string[] {
  const types = new Set<string>();
  weapons.forEach(w => {
    if (w.weaponType) types.add(w.weaponType);
  });
  return Array.from(types).sort();
}

export function getRarityColor(rarity: number): string {
  switch (rarity) {
    case 3:
      return 'bg-gray-500';
    case 4:
      return 'bg-purple-500';
    case 5:
      return 'bg-yellow-500';
    case 6:
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
}

export function getRarityBackgroundColor(rarity: number): string {
  switch (rarity) {
    case 3:
      return 'from-gray-700 to-gray-800';
    case 4:
      return 'from-purple-700 to-purple-800';
    case 5:
      return 'from-yellow-600 to-yellow-700';
    case 6:
      return 'from-orange-600 to-orange-700';
    default:
      return 'from-gray-700 to-gray-800';
  }
}

export function getRarityLabel(rarity: number): string {
  return `${rarity}-Star`;
}
