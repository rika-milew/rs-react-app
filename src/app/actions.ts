'use server';

import type { PokemonWithDescription } from '@/types/api';
import { getItemsById } from '@/services/api';
import { handleQueryError } from '@/utils/error-handlers';

function formatCSV(items: PokemonWithDescription[]): string {
  const headers = [
    'Name',
    'Types',
    'Abilities',
    'Description',
    'Height',
    'Weight',
  ].join(',');

  const rows = items.map((item) => {
    const capitalizedName =
      item.name.length > 0
        ? item.name[0].toUpperCase() + item.name.slice(1)
        : '';
    const name = capitalizedName;
    const types = item.types.map((t) => t.type.name).join(' ') || '';
    const abilities = item.abilities.map((a) => a.ability.name).join(' ') || '';
    const description = (item.description ?? '').replaceAll(',', ' ');
    const height = `${String(item.height * 10)} cm`;
    const weight = `${String(item.weight / 10)} kg`;

    return [name, types, abilities, description, height, weight].join(',');
  });

  return [headers, ...rows].join('\n');
}

export async function generateCSV(
  selectedIds: string[],
): Promise<{ csv: string; fileName: string }> {
  try {
    const items = await getItemsById(selectedIds);
    const csv = formatCSV(items);
    const fileName =
      items.length === 1 ? '1-item.csv' : String(items.length) + '_items.csv';
    return { csv, fileName };
  } catch (error) {
    const result = handleQueryError(error);
    throw new Error(result.error.data);
  }
}
