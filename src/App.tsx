import QueryProvider from '@api/QueryProvider';
import { ErrorBoundary } from '@components/common';
import { Providers } from '@redux/Provider';
import Route from '@router/index';
import { ToastContainer } from 'react-toastify';
import { OfflineSyncProvider } from '@/hooks/useOfflineFormSync';


const PreRoute = () => {
  return <Route />;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
         <OfflineSyncProvider>
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
      </OfflineSyncProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
