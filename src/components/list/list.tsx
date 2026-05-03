import React from 'react';
import type { PokemonListItem, Pokemon } from '@/types/api';
import classNames from 'classnames/bind';
import { getPokemons, getPokemonByName } from '@/api/poke-api';
const cx = classNames.bind(styles);
import styles from './list.module.css';
import { Card } from '../card/card';
import { Loader } from '../loader/loader';
import { Pagination } from '../pagination/pagination';

import { CARD_LIMIT } from '@/constants/constants';

type State = {
  page: number;
  totalPages: number;
  data: Pokemon[];
  loading: boolean;
  error: string | null;
};

type Props = {
  search: string;
};

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

  public componentDidMount() {
    void this.loadData(this.props.search);
  }

  public componentDidUpdate(previousProps: Props) {
    if (previousProps.search !== this.props.search) {
      this.setState({ page: 0 }, () => {
        void this.loadData(this.props.search);
      });
    }
  }
  public loadData = async (searchQuery?: string) => {
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

  private handlePrev = () => {
    this.setState(
      (previous) => ({ page: Math.max(previous.page - 1, 0) }),
      () => {
        void this.loadData(this.props.search);
      }
    );
  };

  private handleNext = () => {
    this.setState(
      (previous) => ({ page: previous.page + 1 }),
      () => {
        void this.loadData(this.props.search);
      }
    );
  };

  public render() {
    const { data, loading, error, page, totalPages } = this.state;

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
          <Pagination
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
          />
        )}
      </section>
    );
  }
}
