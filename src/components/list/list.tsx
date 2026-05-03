import React from 'react';
import type { PokemonListItem, PokemonWithDescription } from '@/types/api';
import classNames from 'classnames/bind';
import { getPokemons, getPokemonFull } from '@/services/api';
const cx = classNames.bind(styles);
import styles from './list.module.css';
import { Card } from '../card/card';
import { Loader } from '../loader/loader';
import { Pagination } from '../pagination/pagination';
import { Button } from '../button/button';

import {
  CARD_LIMIT,
  LOADING_DELAY_MS,
  HTTP_STATUS,
} from '@/constants/constants';

import { ApiError } from '@/services/api-error';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type State = {
  page: number;
  totalPages: number;
  data: PokemonWithDescription[];
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

      await delay(LOADING_DELAY_MS);

      const { page } = this.state;
      let searchData: PokemonWithDescription[] = [];
      let totalPages = 1;

      if (searchQuery?.trim()) {
        const query = searchQuery.trim().toLowerCase();

        const pokemon = await getPokemonFull(query);

        searchData = [pokemon];
        totalPages = 1;
      } else {
        const offset = page * CARD_LIMIT;
        const data = await getPokemons(offset, CARD_LIMIT);

        totalPages = Math.ceil(data.count / CARD_LIMIT);

        searchData = await Promise.all(
          data.results.map((item: PokemonListItem) => getPokemonFull(item.name))
        );
      }

      this.setState({
        data: searchData,
        loading: false,
        totalPages,
      });
    } catch (error) {
      let message = 'Something went wrong. Please try again.';

      if (error instanceof ApiError) {
        if (error.status === HTTP_STATUS.NOT_FOUND) {
          message = 'Pokemon not found.';
        }

        if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          message = 'Server error. Try again later.';
        }

        if (error.status === 0) {
          message = 'Network error. Check your internet connection.';
        }
      }

      this.setState({
        error: message,
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

    if (error) {
      return (
        <div className={cx('state')}>
          <p>{error}</p>
          <Button
            text="Try again"
            onClick={() => void this.loadData(this.props.search)}
          />
        </div>
      );
    }

    if (!loading && !error && data.length === 0 && this.props.search.trim()) {
      return (
        <div className={cx('state')}>
          <p>Nothing found</p>
        </div>
      );
    }

    return (
      <section className={cx('section')}>
        <h2 className={cx('title')}>Results</h2>
        {loading && (
          <div className={cx('loader-container')}>
            <Loader />
          </div>
        )}
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
