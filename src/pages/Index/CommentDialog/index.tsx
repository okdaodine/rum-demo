import React from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IComment, IPost } from 'apis/types';
import Dialog from 'components/Dialog';
import EditorDialog from './EditorDialog';
import Button from 'components/Button';
import CommentItem from './CommentItem';
import store from 'store2';
import { CommentApi } from 'apis';
import { TrxStorage } from 'apis/common';
import { getSocket } from 'utils/socket';

interface IProps {
  post: IPost,
  onPostChanged: (post: IPost) => void,
  open: boolean
  onClose: () => void
}

const CommentContainer = observer((props: IProps) => {
  const state = useLocalObservable(() => ({
    content: '',
    ids: [] as string[],
    subIdsMap: {} as Record<string, string[]>,
    commentMap: {} as Record<string, IComment>,
    showEditorDialog: false
  }));
  
  React.useEffect(() => {
    (async () => {
      try {
        const comments = await CommentApi.list({
          to: props.post.id,
          viewer: store('address'),
          limit: 200
        });
        runInAction(() => {
          for (const comment of comments) {
            addCommentToState(comment);
          }
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  React.useEffect(() => {
    const listener = async (comment: IComment) => {
      console.log('received a comment');
      console.log({ comment });
      if (state.commentMap[comment.id]) {
        state.commentMap[comment.id].storage = TrxStorage.chain;
      }
    }
    getSocket().on('comment', listener);
    return () => {
      getSocket().off('comment', listener);
    }
  }, []);

  const addCommentToState = (comment: IComment) => {
    runInAction(() => {
      state.commentMap[comment.id] = comment;
      state.ids.push(comment.id);
    });
  }

  const addComment = async (comment: IComment) => {
    addCommentToState(comment);
    props.onPostChanged({
      ...props.post,
      extra: {
        ...props.post.extra,
        commentCount: props.post.extra.commentCount + 1
      }
    });
  }

  return (
    <div className="w-[600px] p-8 pt-6">
      <div className="text-18 text-center font-bold pb-4">Comment</div>
      
      <div className="py-5 w-full">
        <Button className="mx-auto block" onClick={() => {
          state.showEditorDialog = true;
        }}>Add a comment</Button>
      </div>

      <div className="mt-5">
        {state.ids.map((id) => {
          const subIds = state.subIdsMap[id] || [];
          return (
            <div key={id} className="mb-4">
              <CommentItem
                comment={state.commentMap[id]}
                addComment={addComment}
                onCommentChanged={async (comment) => {
                  state.commentMap[comment.id] = comment;
                }}
              />
              {subIds.map((subId) => (
                <div key={subId} className="ml-6 mt-4">
                  {state.commentMap[subId] && (
                    <CommentItem
                      comment={state.commentMap[subId]}
                      addComment={addComment}
                      onCommentChanged={async (comment) => {
                        state.commentMap[comment.id] = comment;
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <EditorDialog
        open={state.showEditorDialog}
        onClose={() => {
          state.showEditorDialog = false;
        }}
        commentContext={{
          to: props.post.id,
        }}
        addComment={addComment}
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
    <CommentContainer {...props} />
  </Dialog>
));
