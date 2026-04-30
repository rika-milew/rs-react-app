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
    const {
      pokemon: {
        name,
        height,
        weight,
        sprites: { front_default },
      },
    } = this.props;

    return (
      <div className={cx('card')}>
        <img className={cx('image')} src={front_default} alt={name} />

        <h3 className={cx('name')}>{name}</h3>

        <p>Height: {height}</p>
        <p>Weight: {weight}</p>
      </div>
    );
  }
}
