import { useState } from 'react';
import styles from './card.module.css';
import type { PokemonWithDescription } from '@/types/api';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

import mockImage from '@/assets/mock-image.png';

export const ID_LENGTH = 3;

type Props = {
  item: PokemonWithDescription;
  onClick?: () => void;
};

export function Card({ item, onClick }: Props) {
  const { id, name, height, weight, sprites, types, abilities, description } =
    item;

  const image =
    sprites.other?.['official-artwork']?.front_default ??
    sprites.front_default ??
    mockImage;

  const [imgSource, setImgSource] = useState(image);

  const handleImageError = () => {
    if (imgSource !== sprites.front_default && sprites.front_default) {
      setImgSource(sprites.front_default);
    } else {
      setImgSource(mockImage);
    }
  };

  const typeContent = types.map((t) => t.type.name).join(', ');
  const abilityContent = abilities.map((a) => a.ability.name).join(', ');

  const capitalizedName =
    name.length > 0 ? name[0].toUpperCase() + name.slice(1) : name;

  const handleClick = () => {
    onClick?.();
  };

  return (
    <article data-card className={cx('card')} onClick={handleClick}>
      <div className={cx('image-container')}>
        <span className={cx('card-id')}>
          #{id.toString().padStart(ID_LENGTH, '0')}
        </span>
        <img
          className={cx('image')}
          src={imgSource}
          alt={name ? `${name} Pokémon image` : 'Pokémon image'}
          onError={handleImageError}
        />
      </div>
      <h3 className={cx('name')}>{capitalizedName}</h3>
      <div className={cx('types')}>
        <p className={cx('params-label')}>Types:</p>
        <div className={cx('params-list')}>{typeContent}</div>
      </div>
      <div className={cx('abilities')}>
        <p className={cx('params-label')}>Abilities:</p>
        <div className={cx('params-list')}>{abilityContent}</div>
      </div>
      {description && (
        <div className={cx('description')}>
          <p className={cx('params-label')}>Description:</p>
          <p>{description}</p>
        </div>
      )}
      <div className={cx('info')}>
        <p>
          <span className={cx('params-label')}>Height:</span> {height * 10} cm
        </p>
        <p>
          <span className={cx('params-label')}>Weight:</span> {weight / 10} kg
        </p>
      </div>
    </article>
  );
}
