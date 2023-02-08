import { observer, useLocalObservable } from 'mobx-react-lite';
import { IComment } from 'apis/types';
import { TrxStorage } from 'apis/common';
import { TrxApi } from 'apis';
import classNames from 'classnames';
import { HiOutlineRefresh } from 'react-icons/hi';
import { AiOutlineHeart } from 'react-icons/ai';

interface IProps {
  comment: IComment,
  addComment: (comment: IComment) => void
  onCommentChanged: (comment: IComment) => void
}

export default observer((props: IProps) => {
  const state = useLocalObservable(() => ({
    submitting: false,
    updatingComment: null as IComment | null,
    showEditorDialog: false,
  }));
  const { comment } = props;
  const profileName = comment.extra!.profile ? comment.extra!.profile.name : comment.userAddress.slice(0, 10);

  const updateCounter = async () => {
    if (state.submitting) {
      return;
    }
    state.submitting = true;
    try {
      await TrxApi.createActivity({
        type: comment.extra.liked ? 'Dislike' : 'Like',
        object: {
          type: 'Note',
          id: comment.id,
          inreplyto: {
            type: 'Note',
            id: comment.to
          }
        }
      });
      props.onCommentChanged({
        ...comment,
        extra: {
          ...comment.extra,
          likeCount: comment.extra.likeCount + (comment.extra.liked ? -1 : 1),
          liked: !comment.extra.liked
        }
      });
    } catch (err) {
      console.log(err);
    }
    state.submitting = false;
  }

  return (
    <div className="border border-gray-300 rounded-12 p-4 py-3 text-gray-700 flex relative">
      <img src={`https://ui-avatars.com/api/?name=${profileName.slice(-1)}`} alt="avatar" className="w-10 h-10 rounded-full" />
      <div className="ml-3 mt-1 flex-1">
        <div className="text-gray-88 font-bold flex">
          {profileName}
        </div>
        <div className="mt-2 text-gray-500">
          {comment.content}
        </div>
        <div className="mt-3 text-gray-700/60 text-12 flex items-center">
          <div className={classNames({
            'text-sky-500 font-bold': comment.extra!.liked
          }, "mr-8 cursor-pointer flex items-center")} onClick={() => {
            updateCounter();
          }}>
              <AiOutlineHeart className="text-18 mr-1" /> {comment.extra.likeCount || ''}
          </div>
          <div className="mr-8 flex items-center">
            {comment.storage === TrxStorage.cache && (
              <HiOutlineRefresh className="text-18 animate-spin opacity-70" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
});