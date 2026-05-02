import React from 'react';
import classNames from 'classnames/bind';
import styles from './search-bar.module.css';

import { Button } from '@/components/button/button';

const cx = classNames.bind(styles);

interface Props {
  value?: string;
  onSearch: (value: string) => void;
}

interface State {
  query: string;
}

export class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      query: props.value ?? '',
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        query: this.props.value ?? '',
      });
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.query.trim();

    if (trimmed) {
      localStorage.setItem('search', trimmed);
    } else {
      localStorage.removeItem('search');
    }

    this.props.onSearch(trimmed);
  };

  render() {
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
