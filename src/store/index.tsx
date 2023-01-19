import React from 'react';
import { toJS } from 'mobx';
import { useLocalStore } from 'mobx-react-lite';
import { createSnackbarStore } from './snackbar';
import { createConfirmDialogStore } from './confirmDialog';

const storeContext = React.createContext<any>(null);

interface IProps {
  children: React.ReactNode;
}

const useCreateStore = () => ({
  snackbarStore: useLocalStore(createSnackbarStore),
  confirmDialogStore: useLocalStore(createConfirmDialogStore),
});

export const StoreProvider = ({ children }: IProps) => {
  const store = useCreateStore();
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error('You have forgot to use StoreProvider');
  }
  (window as any).toJS = toJS;
  (window as any).store = store;
  return store as ReturnType<typeof useCreateStore>;
};
