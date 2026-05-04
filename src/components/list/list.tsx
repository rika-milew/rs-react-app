import React from 'react';
import type { PokemonWithDescription } from '@/types/api';
import classNames from 'classnames/bind';
import styles from './list.module.css';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { StateView } from '@/components/state-view/state-view';

import { LOADING_DELAY_MS } from '@/constants/constants';

import { getData } from '@/services/data-service';

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

  private load = () => {
    void this.loadData(this.props.search);
  };

  public componentDidMount() {
    this.load();
  }

  public componentDidUpdate(previousProps: Props) {
    if (previousProps.search !== this.props.search) {
      this.setState({ page: 0 }, () => {
        this.load();
      });
    }
  }

  private requestId = 0;

  public loadData = async (searchQuery?: string) => {
    this.requestId += 1;
    const currentRequestId = this.requestId;
    try {
      this.setState({ status: 'loading', error: null });

      const { page } = this.state;
      await delay(LOADING_DELAY_MS);

      const result = await getData(page, searchQuery);

      if (currentRequestId !== this.requestId) {
        return;
      }

      switch (result.type) {
        case 'success': {
          this.setState({
            data: result.data,
            totalPages: result.totalPages,
            status: 'success',
          });
          break;
        }

        case 'not-found': {
          this.setState({
            data: [],
            totalPages: 1,
            status: 'not-found',
          });
          break;
        }

        case 'error': {
          this.setState({
            status: 'error',
            error: result.message,
          });
          break;
        }
      }
    } catch {
      this.setState({
        status: 'error',
        error: 'Something went wrong. Try again later.',
      });
    }
  };

  private handlePrev = () => {
    this.setState(
      (previous) => ({ page: Math.max(previous.page - 1, 0) }),
      () => {
        this.load();
      }
    );
  };

  private handleNext = () => {
    this.setState(
      (previous) => ({ page: previous.page + 1 }),
      () => {
        this.load();
      }
    );
  };

  public render() {
    const { data, error, status, page, totalPages } = this.state;

    if (status === 'error') {
      return (
        <StateView
          message={error ?? 'Something went wrong. Try again later.'}
          onReload={() => {
            this.load();
          }}
        />
      );
    }

    if (status === 'not-found') {
      return (
        <StateView
          message="Pokemon not found."
          onReload={() => {
            this.load();
          }}
        />
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
