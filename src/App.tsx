import QueryProvider from '@api/QueryProvider';
import { ErrorBoundary } from '@components/common';
import { SecurityProvider } from '@pages/SecurityProvide';
import { Providers } from '@redux/Provider';
import Route from '@router/index';
import { ToastContainer } from 'react-toastify';


const PreRoute = () => {
  return <Route />;
};

function App() {
  return (
    <SecurityProvider>
      <ErrorBoundary>
        <QueryProvider>
          <Providers>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ zIndex: 10000 }}
            />
            <PreRoute />
          </Providers>
        </QueryProvider>
      </ErrorBoundary>
    </SecurityProvider>

  );
}

export default App;
