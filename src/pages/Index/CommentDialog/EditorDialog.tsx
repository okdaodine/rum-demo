import { observer, useLocalObservable } from 'mobx-react-lite';
import { TextField } from '@material-ui/core';
import { IComment } from 'apis/types';
import { TrxStorage } from 'apis/common';
import { TrxApi, ProfileApi } from 'apis';
import store from 'store2';
import Dialog from 'components/Dialog';
import * as uuid from 'uuid';

export interface ICommentContext {
  to: string
}

interface IProps {
  comment?: null | IComment
  open: boolean
  onClose: () => void
  commentContext: ICommentContext
  addComment: (comment: IComment) => void
  onCommentChanged?: (comment: IComment) => void
}

const Editor = observer((props: IProps) => {
  const state = useLocalObservable(() => ({
    content: props.comment ? props.comment.content : '',
  }));

  const submitComment = async (content: string) => {
    const id = uuid.v4();
    const res = await TrxApi.createActivity({
      type: 'Create',
      object: {
        type: 'Note',
        id,
        content,
        inreplyto: {
          type: 'Note',
          id: props.commentContext.to
        }
      }
    });
    console.log(res);
    if (props.comment && props.onCommentChanged) {
      props.onCommentChanged({
        ...props.comment,
        storage: TrxStorage.cache,
        content
      });
    } else {
      const profile = await ProfileApi.get(store('address'));
      props.addComment({
        to: props.commentContext.to,
        trxId: res.trx_id,
        id,
        content,
        userAddress: store('address'),
        timestamp: Date.now(),
        storage: TrxStorage.cache,
        extra: {
          profile,
          liked: false,
          likeCount: 0,
        }
      })
    }
    state.content = '';
    props.onClose();
  }

  return (
    <div className="w-[600px] p-8 pt-6">
      <TextField
        className="w-full"
        placeholder="What's happening?"
        size="small"
        multiline
        autoFocus
        minRows={3}
        value={state.content}
        onChange={(e) => { state.content = e.target.value; }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && state.content.trim()) {
            submitComment(state.content.trim());
            e.preventDefault();
          }
        }}
        margin="dense"
        variant="outlined"
        type="memo"
      />
    </div>
  )
});

export default observer((props: IProps) => (
  <Dialog
    hideCloseButton
    open={props.open}
    onClose={props.onClose}
    transitionDuration={{
      enter: 300,
    }}
  >
    <Editor {...props} />
  </Dialog>
));
