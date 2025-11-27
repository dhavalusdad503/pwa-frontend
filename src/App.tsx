import Router from '@/Router';
import { Providers } from '@/redux/Provider';

function App() {
  return (
    <Providers>
      <Router />
    </Providers>
  );
}

export default App;
