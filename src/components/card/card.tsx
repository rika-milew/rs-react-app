import React from 'react';
import styles from './card.module.css';
import type { Pokemon } from '@/types/api';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface Props {
  pokemon: Pokemon;
}

export class Card extends React.Component<Props> {
  render() {
    const { name, height, weight, sprites, types, abilities } =
      this.props.pokemon;

    const image =
      sprites.other?.['official-artwork']?.front_default ??
      sprites.front_default;

    const typeContent = types.map((t) => t.type.name);
    const abilityContent = abilities.map((a) => a.ability.name);

    return (
      <div className={cx('card')}>
        <img className={cx('image')} src={image} alt={name} />
        <h3 className={cx('name')}>{name}</h3>
        <div className={cx('types')}>
          <p className={cx('label')}>Types:</p>
          <div className={cx('list')}>
            {typeContent.map((type) => (
              <span key={type} className={cx('type')}>
                {type}
              </span>
            ))}
          </div>
        </div>
        <div className={cx('abilities')}>
          <p className={cx('label')}>Abilities:</p>
          <div className={cx('list')}>
            {abilityContent.map((ability) => (
              <span key={ability} className={cx('ability')}>
                {ability}
              </span>
            ))}
          </div>
        </div>
        <div className={cx('info')}>
          <p>Height: {height * 10} cm</p>
          <p>Weight: {weight / 10} kg</p>
        </div>
      </div>
    );
  }
}
