import { observer, useLocalObservable } from 'mobx-react-lite';
import CommentDialog from './CommentDialog';
import PostEditorModal from './PostEditorModal';
import { IPost } from 'apis/types';
import { TrxStorage } from 'apis/common';
import { TrxApi } from 'apis';
import classNames from 'classnames';
import { HiOutlineRefresh } from 'react-icons/hi';
import store from 'store2';
import { FaRegComment } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';

interface IProps {
  post: IPost,
  onPostEdit: (content: string) => void,
  onPostChanged: (post: IPost) => void,
  onDeletePost: () => void
}

export default observer((props: IProps) => {
  const { post } = props;
  const state = useLocalObservable(() => ({
    submitting: false,
    showPostEditorModal: false,
    showCommentDialog: false
  }));
  const profileName = post.extra.profile?.name || '';
  const isPostOwner = post.userAddress === store('address')

  const updateCounter = async () => {
    if (state.submitting) {
      return;
    }
    state.submitting = true;
    try {
      await TrxApi.createActivity({
        type: post.extra.liked ? 'Dislike' : 'Like',
        object: {
          type: 'Note',
          id: post.id,
        }
      });
      props.onPostChanged({
        ...post,
        extra: {
          ...post.extra,
          likeCount: post.extra.likeCount + (post.extra.liked ? -1 : 1),
          liked: !post.extra.liked
        }
      });
    } catch (err) {
      console.log(err);
    }
    state.submitting = false;
  }

  return (
    <div className="border border-gray-300 rounded-12 p-5 text-gray-700 flex mb-5 relative">
      <img src={`https://ui-avatars.com/api/?name=${profileName.slice(-1)}`} alt="avatar" className="w-10 h-10 rounded-full" />
      <div className="ml-3 mt-1 flex-1">
        <div className="text-gray-88 font-bold">{profileName}</div>
        <div className="mt-[6px] text-gray-500">
          {post.content}
        </div>
        <div className="mt-3 opacity-90 text-12 flex items-center text-gray-700/60">
          <div className={classNames({
            'text-sky-500 font-bold': post.extra!.liked
          }, "mr-8 cursor-pointer flex items-center")} onClick={() => {
            updateCounter();
          }}>
              <AiOutlineHeart className="text-18 mr-1" /> {post.extra.likeCount || ''}
          </div>
          <div className="mr-8 cursor-pointer flex items-center" onClick={() => {
            state.showCommentDialog = true;
          }}>
              <FaRegComment className="text-16 mr-1 opacity-80" /> {post.extra.commentCount || ''}
          </div>
          {isPostOwner && post.storage !== TrxStorage.cache && (
            <div
              className="mr-8 cursor-pointer"
              onClick={() => {
                state.showPostEditorModal = true;
              }}
            >
              <AiOutlineEdit className="text-18 mr-1" />
            </div>
          )}
          {isPostOwner && post.storage !== TrxStorage.cache && (
            <div
              className="mr-8 cursor-pointer"
              onClick={props.onDeletePost}
            >
              <AiOutlineClose className="text-18 mr-1" />
            </div>
          )}
          <div className="mr-8 flex items-center">
            {post.storage === TrxStorage.cache && (
              <HiOutlineRefresh className="text-18 animate-spin opacity-70" />
            )}
          </div>
        </div>
      </div>
      <PostEditorModal
        open={state.showPostEditorModal}
        onClose={() => {
          state.showPostEditorModal = false;
        }}
        post={props.post}
        onPostEdit={props.onPostEdit}
      />
      <CommentDialog
        open={state.showCommentDialog}
        onClose={() => {
          state.showCommentDialog = false;
        }}
        post={props.post}
        onPostChanged={props.onPostChanged}
      />
    </div>
  )
});