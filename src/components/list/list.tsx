import React from 'react';
import type { PokemonListItem, PokemonWithDescription } from '@/types/api';
import classNames from 'classnames/bind';
import { getPokemons, getPokemonFull } from '@/services/api';
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

const cx = classNames.bind(styles);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Status = 'loading' | 'error' | 'not-found' | 'success';

type State = {
  page: number;
  totalPages: number;
  data: PokemonWithDescription[];
  status: Status;
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
      status: 'loading',
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
      this.setState({ status: 'loading', error: null });

      const { page } = this.state;
      await delay(LOADING_DELAY_MS);

      let searchData: PokemonWithDescription[] = [];
      let totalPages = 1;

      const query = searchQuery?.trim().toLowerCase();
      if (query) {
        try {
          const pokemon = await getPokemonFull(query);
          searchData = [pokemon];
        } catch (error) {
          if (
            error instanceof ApiError &&
            error.status === HTTP_STATUS.NOT_FOUND
          ) {
            this.setState({
              status: 'not-found',
              data: [],
              error: null,
              totalPages: 1,
            });
            return;
          }
          throw error;
        }
        totalPages = 1;
      } else {
        const offset = page * CARD_LIMIT;

        const data = await getPokemons(offset, CARD_LIMIT);

        totalPages = Math.ceil(data.count / CARD_LIMIT);

        searchData = await Promise.all(
          data.results.map((item: PokemonListItem) => getPokemonFull(item.name))
        );
      }

      const status: Status = searchData.length > 0 ? 'success' : 'not-found';

      this.setState({
        data: searchData,
        totalPages,
        status,
      });
    } catch (error) {
      let message = 'Something went wrong. Please try again.';

      if (error instanceof ApiError) {
        if (error.status === HTTP_STATUS.NOT_FOUND) {
          message = 'Pokemon not found.';
        } else if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          message = 'Server error. Try again later.';
        } else if (error.status === 0) {
          message = 'Network error. Check your internet connection.';
        }
      }

      this.setState({
        status: 'error',
        error: message,
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
    const { data, error, status, page, totalPages } = this.state;

    if (status === 'error') {
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

    if (status === 'not-found') {
      return (
        <div className={cx('state')}>
          <p>Pokemon not found.</p>
          <Button
            text="Try again"
            onClick={() => void this.loadData(this.props.search)}
          />
        </div>
      );
    }

    return (
      <section className={cx('section')}>
        <h2 className={cx('title')}>Results</h2>
        {status === 'loading' && (
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
            loading={status === 'loading'}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
          />
        )}
      </section>
    );
  }
}
