'use client';

import { Weapon } from '@/lib/types';
import { getRarityLabel, getRarityColor } from '@/lib/weapons-utils';
import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface WeaponTableProps {
  weapons: Weapon[];
}

type SortField = 'name' | 'rarity' | 'attributeStats' | 'skillStats';
type SortOrder = 'asc' | 'desc';

export function WeaponTable({ weapons }: WeaponTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedWeapons = [...weapons].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortHeader = ({
    label,
    field,
  }: {
    label: string;
    field: SortField;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
    >
      {label}
      <ArrowUpDown
        className={`h-4 w-4 ${sortField === field ? 'opacity-100 text-primary' : 'opacity-0'}`}
      />
    </button>
  );

  if (weapons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No weapons found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Name" field="name" />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Rarity" field="rarity" />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Attribute" field="attributeStats" />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Skill" field="skillStats" />
            </th>
            <th className="px-4 py-3 text-left">Energy Alluvium</th>
          </tr>
        </thead>
        <tbody>
          {sortedWeapons.map(weapon => (
            <tr key={weapon.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{weapon.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-1 ${getRarityColor(
                    weapon.rarity,
                  )} text-white text-xs font-semibold rounded`}
                >
                  {getRarityLabel(weapon.rarity)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{weapon.attributeStats}</td>
              <td className="px-4 py-3 text-muted-foreground">{weapon.skillStats}</td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {weapon.domains.map(domain => (
                    <span
                      key={domain}
                      className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
