export interface Weapon {
  id: string;
  name: string;
  rarity: 3 | 4 | 5 | 6;
  image: string;
  domains: string[];
  attributeStats: string;
  secondaryStats: string;
  skillStats: string;
  description: string;
}

export interface FilterState {
  rarity: Set<number>;
  domains: Set<string>;
  attributeStats: Set<string>;
  skillStats: Set<string>;
  searchQuery: string;
}

export type ViewMode = 'list' | 'card' | 'table';
