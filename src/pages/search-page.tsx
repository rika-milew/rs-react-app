import React from 'react';
import { getPokemons } from '@/api/poke-api';
import { List } from '@/components/list/list';

interface State {
  pokemons: { name: string; url: string }[];
  loading: boolean;
  error: string | null;
}

export class SearchPage extends React.Component<object, State> {
  state: State = {
    pokemons: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    void this.loadData();
  }

  loadData = async () => {
    try {
      const data = await getPokemons(0, 20);

      this.setState({
        pokemons: data.results,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: (error as Error).message,
        loading: false,
      });
    }
  };

  render() {
    const { pokemons, loading, error } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return <List data={pokemons} />;
  }
}
