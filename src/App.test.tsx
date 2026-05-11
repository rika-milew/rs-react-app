import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders app', () => {
    render(<App />);

    expect(document.body).toBeInTheDocument();
  });
});
