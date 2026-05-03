import React from 'react';
import { List } from '@/components/list/list';
import { SearchBar } from '@/components/search-bar/search-bar';

type State = {
  searchQuery: string;
};

export class SearchPage extends React.Component<Record<string, never>, State> {
  constructor(props: Record<string, never>) {
    super(props);

    const savedSearch = localStorage.getItem('search');

    this.state = {
      searchQuery: savedSearch?.trim() ? savedSearch : '',
    };
  }

  public handleSearch = (value: string) => {
    this.setState({ searchQuery: value });
  };

  public render() {
    const { searchQuery } = this.state;

    return (
      <>
        <SearchBar value={searchQuery} onSearch={this.handleSearch} />
        <List search={searchQuery} />
      </>
    );
  }
}
