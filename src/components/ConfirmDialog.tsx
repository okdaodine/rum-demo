import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import Button from 'components/Button';
import { useStore } from 'store';

export default observer(() => {
  const { confirmDialogStore } = useStore();
  const {
    open,
    ok,
    cancel,
    content,
    cancelText,
    cancelDisabled,
    okText = 'Ok',
    contentClassName,
    loading,
  } = confirmDialogStore;

  return (
    <Dialog
      transitionDuration={{
        appear: 500,
        enter: 300,
        exit: 500,
      }}
      open={open}
      onClose={() => {
        if (!cancel) {
          confirmDialogStore.hide();
        }
      }}
      className="flex justify-center items-center"
    >
      <DialogTitle>
        <span className="block pt-6 px-1" />
      </DialogTitle>
      <DialogContent>
        <span className="block px-4 text-center">
          <DialogContentText>
            <span
              style={{
                maxWidth: 250,
              }}
              className={`block text-gray-600 leading-7 ${contentClassName}`}
            >
              <span className="block" dangerouslySetInnerHTML={{ __html: content }}></span>
            </span>
          </DialogContentText>
        </span>
      </DialogContent>
      <DialogActions>
        <span className="flex pt-3 pb-2 px-6 items-center justify-end w-64">
          {!cancelDisabled && (
            <span
              className="block text-blue-400 mr-6 pr-1 cursor-pointer"
              onClick={() => {
                if (cancel) {
                  cancel();
                } else {
                  confirmDialogStore.hide();
                }
              }}
            >
              {cancelText}
            </span>
          )}
          <Button onClick={() => ok()} isDoing={loading}>
            {okText}
          </Button>
        </span>
      </DialogActions>
      <span className="block pb-2" />
    </Dialog>
  );
});
