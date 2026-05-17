import type { PokemonWithDescription } from '@/types/api';

export type DescriptionOption = {
  label: string;
  value: string | number | undefined;
  visible: 'always' | 'detailed';
  condition?: boolean;
  variant?: 'inline' | 'block';
};

type CardConfig = {
  data: DescriptionOption[];
};

export const cardConfig = (item: PokemonWithDescription): CardConfig => {
  const { height, weight, types, abilities, description } = item;

  const typeContent = types.map((t) => t.type.name).join(', ');
  const abilityContent = abilities.map((a) => a.ability.name).join(', ');

  return {
    data: [
      {
        label: 'Types:',
        value: typeContent,
        visible: 'detailed' as const,
        condition: typeContent.length > 0,
        variant: 'block' as const,
      },
      {
        label: 'Abilities:',
        value: abilityContent,
        visible: 'detailed' as const,
        condition: abilityContent.length > 0,
        variant: 'block' as const,
      },
      {
        label: 'Description:',
        value: description,
        visible: 'always' as const,
        condition: !!description,
        variant: 'block' as const,
      },
      {
        label: 'Height:',
        value: String(height * 10) + ' cm',
        visible: 'detailed' as const,
        variant: 'inline' as const,
      },
      {
        label: 'Weight:',
        value: `${String(weight / 10)} kg`,
        visible: 'detailed' as const,
        variant: 'inline' as const,
      },
    ],
  };
};
