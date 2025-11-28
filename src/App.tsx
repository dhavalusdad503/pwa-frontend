import { ToastContainer } from 'react-toastify';

import QueryProvider from '@/api/QueryProvider';
import { Providers } from '@/redux/Provider';
import Router from '@/Router';

function App() {
  return (
    <QueryProvider>
      <Providers>
        {/* <SocketProvider> */}
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
        <Router />
        {/* <PreRoute /> */}
        {/* </SocketProvider> */}
      </Providers>
    </QueryProvider>
  );
}

export default App;
