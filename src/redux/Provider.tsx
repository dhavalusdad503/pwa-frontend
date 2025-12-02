import type { PropsWithChildren } from 'react';

import SectionLoader from '@lib/Common/Loader/Spinner';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persister, store } from './store';

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      {' '}
      <PersistGate loading={<SectionLoader />} persistor={persister}>
        {children}
      </PersistGate>
    </Provider>
  );
}
