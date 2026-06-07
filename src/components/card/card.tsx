import classNames from 'classnames/bind';
import { useState } from 'react';
import type { PokemonWithDescription } from '@/types/api';
import { cardConfig } from './card.config';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toggleItem } from '@/store/slice';
import type { MouseEvent, KeyboardEvent, ChangeEvent } from 'react';
import styles from './card.module.css';

const cx = classNames.bind(styles);

import mockImage from '@/assets/mock-image.png';

export const ID_LENGTH = 3;

type CardProps = {
  item: PokemonWithDescription;
  variant?: 'detailed' | 'short';
  onClick?: () => void;
};

export function Card({ item, variant = 'detailed', onClick }: CardProps) {
  const { id, name, sprites } = item;

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

  const capitalizedName =
    name.length > 0 ? name[0].toUpperCase() + name.slice(1) : name;

  const isDetailed = variant === 'detailed';

  const config = cardConfig(item);

  const options = config.data.filter(
    (option) =>
      (option.visible === 'always' || isDetailed) && option.condition !== false,
  );

  const handleClick = (event: MouseEvent | KeyboardEvent) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest('[data-checkbox]')
    ) {
      return;
    }
    onClick?.();
  };

  return (
    <article
      data-card
      className={cx('card', { detailed: variant === 'detailed' })}
      onClick={handleClick}
      onKeyDown={(event_) => {
        if (event_.key === 'Enter' || event_.key === ' ') {
          if (
            event_.target instanceof HTMLElement &&
            event_.target.closest('[data-checkbox]')
          ) {
            return;
          }
          event_.preventDefault();
          handleClick(event_);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${name}`}
    >
      <div className={cx('checkbox-container')}>
        <Checkbox id={id} name={name} />
      </div>
      <div className={cx('image-container')}>
        <span className={cx('card-id')}>
          #{id.toString().padStart(ID_LENGTH, '0')}
        </span>
        <img
          className={cx('image')}
          src={imgSource}
          alt={name || 'Pokémon image'}
          onError={handleImageError}
        />
      </div>
      <h3 className={cx('name')}>{capitalizedName}</h3>
      <div className={cx('card-options')}>
        {options.map((option, index) => (
          <CardOption
            key={`${option.label}-${String(index)}`}
            label={option.label}
            value={option.value ?? '—'}
            variant={option.variant}
          />
        ))}
      </div>
    </article>
  );
}

type CardOptionProps = {
  label: string;
  value: string | number;
  variant?: 'inline' | 'block';
};

function CardOption({ label, value, variant = 'block' }: CardOptionProps) {
  if (variant === 'inline') {
    return (
      <p className={cx('card-option', 'inline')}>
        <span className={cx('params-label')}>{label}</span> {value}
      </p>
    );
  }

  return (
    <div className={cx('card-option')}>
      <p className={cx('params-label')}>{label}</p>
      <div className={cx('params-list')}>{value}</div>
    </div>
  );
}

type CheckboxProps = {
  id: number;
  name: string;
};

function Checkbox({ id, name }: CheckboxProps) {
  const dispatch = useDispatch();
  const isSelectedItem = useSelector((state: RootState) =>
    state.selectedItems.selectedItems.includes(id.toString()),
  );

  const handleCheckboxClick = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    dispatch(toggleItem(id.toString()));
  };

  return (
    <input
      type="checkbox"
      data-checkbox
      className={cx('checkbox')}
      checked={isSelectedItem}
      onChange={handleCheckboxClick}
      onClick={(event) => {
        event.stopPropagation();
      }}
      aria-label={`Select ${name}`}
    />
  );
}
