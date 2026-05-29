import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

import './styles/index.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
