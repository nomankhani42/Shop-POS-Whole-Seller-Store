'use client'; // Ensure this is a Client Component

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/Redux Store/index';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ReduxProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
