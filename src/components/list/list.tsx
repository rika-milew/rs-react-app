import React from 'react';
import { PokemonListItem, Pokemon } from '@/types/api';
import classNames from 'classnames/bind';
import { getPokemons, getPokemonByName } from '@/api/poke-api';
const cx = classNames.bind(styles);
import styles from './list.module.css';
import { Card } from '../card/card';

interface State {
  data: Pokemon[];
  loading: boolean;
  error: string | null;
}

export class List extends React.Component<Record<string, never>, State> {
  constructor(props: Record<string, never>) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    void this.loadData();
  }

  loadData = async () => {
    try {
      const data = await getPokemons(0, 20);

      const fullData = await Promise.all(
        data.results.map((item: PokemonListItem) => getPokemonByName(item.name))
      );

      this.setState({
        data: fullData,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  };

  render() {
    const { data, loading, error } = this.state;

    if (loading) {
      return <p className={styles.state}>Loading...</p>;
    }

    if (error) {
      return (
        <div className={styles.state}>
          <p>{error}</p>
          <button onClick={() => void this.loadData()}>Try again</button>
        </div>
      );
    }

    return (
      <section className={cx('section')}>
        <h2 className={cx('title')}>Pokemons</h2>

        <div className={cx('card-container')}>
          {data.map((pokemon) => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </section>
    );
  }
}
