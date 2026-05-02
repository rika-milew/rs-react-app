import React from 'react';
import { PokemonListItem, Pokemon } from '@/types/api';
import classNames from 'classnames/bind';
import { getPokemons, getPokemonByName } from '@/api/poke-api';
const cx = classNames.bind(styles);
import styles from './list.module.css';
import { Card } from '../card/card';
import { Loader } from '../loader/loader';

import { CARD_LIMIT } from '@/constants/constants';

interface State {
  page: number;
  totalPages: number;
  data: Pokemon[];
  loading: boolean;
  error: string | null;
}

interface Props {
  search: string;
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
    void this.loadData(this.props.search);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.search !== this.props.search) {
      this.setState({ page: 0 }, () => {
        void this.loadData(this.props.search);
      });
    }
  }
  loadData = async (searchQuery?: string) => {
    try {
      this.setState({ loading: true, error: null });

      const { page } = this.state;
      let searchData: Pokemon[] = [];
      let totalPages = 1;

      if (searchQuery?.trim()) {
        const query = searchQuery.trim().toLowerCase();

        try {
          const pokemon = await getPokemonByName(query);

          searchData = [pokemon];
        } catch {
          searchData = [];
        }
        totalPages = 1;
      } else {
        const offset = page * CARD_LIMIT;
        const data = await getPokemons(offset, CARD_LIMIT);

        totalPages = Math.ceil(data.count / CARD_LIMIT);

        searchData = await Promise.all(
          data.results.map((item: PokemonListItem) =>
            getPokemonByName(item.name)
          )
        );
      }

      this.setState({
        data: searchData,
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
      return <Loader />;
    }

    if (error) {
      return (
        <div className={cx('state')}>
          <p>{error}</p>
          <button
            onClick={() => {
              void this.loadData(this.props.search);
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    if (data.length === 0 && this.props.search.trim()) {
      return (
        <div className={cx('state')}>
          <p>Nothing found</p>
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
        {!this.props.search && (
          <div className={cx('pagination')}>
            <button
              className={cx('pagination-button')}
              disabled={this.state.page === 0 || loading}
              onClick={() => {
                this.setState(
                  (prev) => ({ page: Math.max(prev.page - 1, 0) }),
                  () => {
                    void this.loadData(this.props.search);
                  }
                );
              }}
            >
              ← Prev
            </button>

            <span className={cx('page-info')}>
              Page{' '}
              <span className={cx('page-number')}>{this.state.page + 1}</span>{' '}
              of {this.state.totalPages}
            </span>

            <button
              className={cx('pagination-button')}
              disabled={this.state.page + 1 >= this.state.totalPages || loading}
              onClick={() => {
                this.setState(
                  (prev) => ({ page: prev.page + 1 }),
                  () => {
                    void this.loadData(this.props.search);
                  }
                );
              }}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    );
  }
}
