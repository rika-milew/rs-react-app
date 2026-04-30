import React from 'react';
import { PokemonListItem, Pokemon } from '@/types/api';
import classNames from 'classnames/bind';
import { getPokemons, getPokemonByName } from '@/api/poke-api';
const cx = classNames.bind(styles);
import styles from './list.module.css';
import { Card } from '../card/card';

import { SEARCH_LIMIT, CARD_LIMIT } from '@/constants/constants';

interface State {
  page: number;
  totalPages: number;
  data: Pokemon[];
  loading: boolean;
  error: string | null;
}

interface Props {
  searchQuery: string;
}

export class List extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      page: 0,
      totalPages: 1,
      data: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    void this.loadData(this.props.searchQuery, this.state.page);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.setState({ page: 0 }, () => {
        void this.loadData(this.props.searchQuery);
      });
    }
  }
  loadData = async (searchQuery?: string, page = this.state.page) => {
    try {
      this.setState({ loading: true, error: null });

      let fullData: Pokemon[] = [];

      let totalPages = 1;

      if (searchQuery) {
        const query = searchQuery.trim().toLowerCase();

        const data = await getPokemons(0, SEARCH_LIMIT);

        const dataList = await Promise.all(
          data.results.map((item: PokemonListItem) =>
            getPokemonByName(item.name)
          )
        );

        const filteredData = dataList.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(query)
        );

        totalPages = Math.ceil(filteredData.length / CARD_LIMIT);

        fullData = filteredData.slice(
          page * CARD_LIMIT,
          (page + 1) * CARD_LIMIT
        );
      } else {
        const offset = page * CARD_LIMIT;
        const data = await getPokemons(offset, CARD_LIMIT);

        totalPages = Math.ceil(data.count / CARD_LIMIT);

        fullData = await Promise.all(
          data.results.map((item: PokemonListItem) =>
            getPokemonByName(item.name)
          )
        );
      }

      this.setState({
        data: fullData,
        loading: false,
        totalPages,
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
      return <p className={cx('state')}>Loading...</p>;
    }

    if (error) {
      return (
        <div className={cx('state')}>
          <p>{error}</p>
          <button
            onClick={() => {
              void this.loadData(this.props.searchQuery, this.state.page);
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return (
      <section className={cx('section')}>
        <h2 className={cx('title')}>Results</h2>
        <div className={cx('card-container')}>
          {data.map((pokemon) => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
        <div className={cx('pagination')}>
          <button
            className={cx('pagination-button')}
            disabled={this.state.page === 0 || loading}
            onClick={() => {
              this.setState(
                (prev) => ({ page: Math.max(prev.page - 1, 0) }),
                () => {
                  void this.loadData(this.props.searchQuery, this.state.page);
                }
              );
            }}
          >
            ← Prev
          </button>

          <span className={cx('page-info')}>
            Page{' '}
            <span className={cx('page-number')}>{this.state.page + 1}</span> of{' '}
            {this.state.totalPages}
          </span>

          <button
            className={cx('pagination-button')}
            disabled={this.state.page + 1 >= this.state.totalPages || loading}
            onClick={() => {
              this.setState(
                (prev) => ({ page: prev.page + 1 }),
                () => {
                  void this.loadData(
                    this.props.searchQuery,
                    this.state.page + 1
                  );
                }
              );
            }}
          >
            Next →
          </button>
        </div>
      </section>
    );
  }
}
