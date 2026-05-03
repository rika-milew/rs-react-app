import React from 'react';
import styles from './card.module.css';
import type { PokemonWithDescription } from '@/types/api';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ID_LENGTH = 3;

type Props = {
  pokemon: PokemonWithDescription;
};

export class Card extends React.Component<Props> {
  public render() {
    const { id, name, height, weight, sprites, types, abilities, description } =
      this.props.pokemon;

    const image =
      sprites.other?.['official-artwork']?.front_default ??
      sprites.front_default;

    const typeContent = types.map((t) => t.type.name).join(', ');
    const abilityContent = abilities.map((a) => a.ability.name).join(', ');

    const capitalizedName =
      name.length > 0 ? name[0].toUpperCase() + name.slice(1) : name;

    return (
      <div className={cx('card')}>
        <div className={cx('image-container')}>
          <span className={cx('id')}>
            #{id.toString().padStart(ID_LENGTH, '0')}
          </span>
          <img className={cx('image')} src={image} alt={name} />
        </div>
        <h3 className={cx('name')}>{capitalizedName}</h3>
        <div className={cx('types')}>
          <p className={cx('label')}>Types:</p>
          <div className={cx('list')}>
            <span>{typeContent}</span>
          </div>
        </div>
        <div className={cx('abilities')}>
          <p className={cx('label')}>Abilities:</p>
          <div className={cx('list')}>
            <span>{abilityContent}</span>
          </div>
        </div>
        {description && (
          <div className={cx('description')}>
            <p className={cx('label')}>Description:</p>
            <p>{description}</p>
          </div>
        )}
        <div className={cx('info')}>
          <p>
            <span className={cx('label')}>Height:</span> {height * 10} cm
          </p>
          <p>
            <span className={cx('label')}>Weight:</span> {weight / 10} kg
          </p>
        </div>
      </div>
    );
  }
}
