import React from 'react';
import classNames from 'classnames/bind';
import styles from './search-bar.module.css';

import { Button } from '@/components/button/button';

const cx = classNames.bind(styles);

type Props = {
  value?: string;
  onSearch: (value: string) => void;
};

type State = {
  query: string;
};

export class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      query: props.value ?? '',
    };
  }

  public componentDidUpdate(previousProps: Props) {
    if (previousProps.value !== this.props.value) {
      this.setState({
        query: this.props.value ?? '',
      });
    }
  }

  public handleChange = (event_: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event_.target.value });
  };

  public handleSearch = () => {
    const trimmed = this.state.query.trim();

    if (trimmed) {
      localStorage.setItem('search', trimmed);
    } else {
      localStorage.removeItem('search');
    }

    this.props.onSearch(trimmed);
  };

  public render() {
    const query = this.state.query;

    return (
      <div className={cx('search-container')}>
        <input
          type="text"
          value={query}
          onChange={this.handleChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              this.handleSearch();
            }
          }}
          placeholder="Search Pokémon..."
          className={cx('input')}
        />
        <Button text="Search" onClick={this.handleSearch} />
      </div>
    );
  }
}
