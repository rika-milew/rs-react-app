import './styles/index.css';

import { Layout } from './components/layout/layout';
import { SearchPage } from '@/pages/search-page';

function App() {
  return (
    <Layout>
      <SearchPage />
    </Layout>
  );
}

export default App;
