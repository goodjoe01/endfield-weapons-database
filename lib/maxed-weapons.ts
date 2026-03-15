const MAXED_WEAPONS_KEY = 'maxedWeapons';

export function getMaxedWeapons(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const stored = localStorage.getItem(MAXED_WEAPONS_KEY);
  return new Set(stored ? JSON.parse(stored) : []);
}

export function isWeaponMaxed(weaponName: string): boolean {
  return getMaxedWeapons().has(weaponName);
}

export function toggleWeaponMaxed(weaponName: string): void {
  const maxed = getMaxedWeapons();
  if (maxed.has(weaponName)) {
    maxed.delete(weaponName);
  } else {
    maxed.add(weaponName);
  }
  localStorage.setItem(MAXED_WEAPONS_KEY, JSON.stringify(Array.from(maxed)));
}

export function filterMaxedWeapons(weaponNames: Set<string>, showMaxed: boolean): Set<string> {
  if (showMaxed) return new Set();
  return getMaxedWeapons();
}
