import React from 'react';
import { List } from '@/components/list/list';

const cx = classNames.bind(styles);
import classNames from 'classnames/bind';
import styles from './search-page.module.css';

import { Button } from '@/components/button/button';

interface State {
  query: string;
  searchQuery: string;
}

export class SearchPage extends React.Component<Record<string, never>, State> {
  constructor(props: Record<string, never>) {
    super(props);

    this.state = {
      query: '',
      searchQuery: '',
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.query.trim();

    if (trimmed) {
      localStorage.setItem('search', trimmed);
    }

    this.setState({
      searchQuery: trimmed,
      query: trimmed,
    });
  };

  componentDidMount() {
    const savedSearch = localStorage.getItem('search');

    if (savedSearch) {
      this.setState({
        query: savedSearch,
        searchQuery: savedSearch,
      });
    }
  }

  render() {
    const { query, searchQuery } = this.state;

    return (
      <>
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
        <List searchQuery={searchQuery} />
      </>
    );
  }
}
