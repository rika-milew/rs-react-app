import React from 'react';

import { PokemonListItem } from '@/types/api';

interface PokemonList {
  data: PokemonListItem[];
}

export class List extends React.Component<PokemonList> {
  render() {
    const { data } = this.props;

    return (
      <section className="pokemon-list">
        <h2 className="title">Pokemons</h2>
        <ul className="list">
          {data.map((item) => (
            <li key={item.name} className="item">
              {item.name}
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
