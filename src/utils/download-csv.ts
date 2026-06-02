import type { PokemonWithDescription } from '@/types/api';

function formatCSV(items: PokemonWithDescription[]): string {
  return items
    .map((item) => {
      const capitalizedName =
        item.name.length > 0
          ? item.name[0].toUpperCase() + item.name.slice(1)
          : '';
      const name = `Name: ${capitalizedName}`;
      const detailsUrl = `Details URL: ${globalThis.location.origin}/details/${item.id.toString()}`;
      const types = `Types: ${item.types.map((t) => t.type.name).join(', ') || ''}`;
      const abilities = `Abilities: ${item.abilities.map((a) => a.ability.name).join(', ') || ''}`;
      const description = `Description: ${item.description ?? ''}`;
      const height = `Height: ${String(item.height * 10)} cm`;
      const weight = `Weight: ${String(item.weight / 10)} kg`;

      return [
        name,
        detailsUrl,
        types,
        abilities,
        description,
        height,
        weight,
      ].join('\n');
    })
    .join('\n\n');
}

export function downloadCSV(items: PokemonWithDescription[]): void {
  if (items.length === 0) {
    return;
  }

  const content = formatCSV(items);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const fileName =
    items.length === 1 ? '1-item.csv' : `${items.length.toString()}_items.csv`;

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
