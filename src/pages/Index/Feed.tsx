import React from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { TextField } from '@material-ui/core';
import { IPost, IProfile } from 'apis/types';
import { TrxStorage } from 'apis/common';
import ProfileEditorDialog from './ProfileEditorDialog';
import PostItem from './PostItem';
import store from 'store2';
import { isEmpty } from 'lodash';
import { PostApi, ProfileApi, TrxApi } from 'apis';
import { getSocket } from 'utils/socket';
import * as uuid from 'uuid';
import { useStore } from 'store';
import { AiOutlineEdit } from 'react-icons/ai';

export default observer(() => {
  const state = useLocalObservable(() => ({
    content: '',
    searchInput: '',
    ids: [] as string[],
    postMap: {} as Record<string, IPost>,
    profileMap: {} as Record<string, IProfile>,
    showProfileEditorModal: false,
    unreadCount: 0,
    get myProfile () {
      return state.profileMap[store('address')]
    }
  }));
  const { confirmDialogStore } = useStore();
  const profileName = state.myProfile ? state.myProfile.name : store('address').slice(0, 10);

  React.useEffect(() => {
    const onNewPost = (post: IPost) => {
      console.log('received a post', post);
      console.log({ post });
      if (state.postMap[post.id]) {
        state.postMap[post.id].storage = TrxStorage.chain;
        if (!state.ids.includes(post.id)) {
          state.ids.unshift(post.id)
        }
      }
    }
    const onPostDelete = (postId: string) => {
      delete state.postMap[postId];
      state.ids = state.ids.filter(id => id !== postId);
    }
    const onPostEdit = (post: IPost) => {
      const existedPost = state.postMap[post.id]
      if (existedPost) {
        existedPost.content = post.content
      }
    }
    getSocket().on('post', onNewPost);
    getSocket().on('postdelete', onPostDelete);
    getSocket().on('postedit', onPostEdit);
    return () => {
      getSocket().off('post', onNewPost);
      getSocket().off('postdelete', onPostDelete);
      getSocket().off('postedit', onPostEdit);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        runInAction(() => {
          state.ids = [];
          state.postMap = {};
        })

        const posts = await PostApi.list({
          viewer: store('address'),
          limit: 100
        });
        runInAction(() => {
          for (const post of posts) {
            state.ids.push(post.id);
            state.postMap[post.id] = post;
          }
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const profile = await ProfileApi.get(store('address'));
        if (!isEmpty(profile)) {
          state.profileMap[store('address')] = profile;
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const submitPost = async (content: string) => {
    const id = uuid.v4();
    const res = await TrxApi.createActivity({
      type: 'Create',
      object: {
        type: "Note",
        id,
        content,
      }
    });
    console.log(res);
    const post = {
      content,
      userAddress: store('address'),
      trxId: res.trx_id,
      id,
      storage: TrxStorage.cache,
      timestamp: Date.now(),
      extra: {
        profile: state.profileMap[store('address')],
        liked: false,
        likeCount: 0,
        commentCount: 0,
      }
    };
    state.ids.unshift(post.id);
    state.postMap[post.id] = post;
    state.content = '';
  }

  const onPostEdit = async (postId: string, content: string) => {
    const post = state.postMap[postId]
    if (!post) { return }
    post.content = content
    TrxApi.createActivity({
      type: 'Update',
      object: {
        type: "Note",
        id: postId,
      },
      result: {
        type: "Note",
        content: content,
      }
    })
  }

  const onPostChanged = async (post: IPost) => {
    state.postMap[post.id] = post;
  }

  const onProfileChanged = async (profile: IProfile) => {
    state.profileMap[profile.userAddress] = profile;
  }

  const onPostDelete = (postId: string) => {
    confirmDialogStore.show({
      content: `Are you sure to delete?`,
      ok: async () => {
        confirmDialogStore.setLoading(true);
        await TrxApi.createActivity({
          type: 'Delete',
          object: {
            type: "Note",
            id: postId,
          }
        });
        state.ids = state.ids.filter(_id => _id !== postId);
        delete state.postMap[postId];
        confirmDialogStore.hide();
        confirmDialogStore.setLoading(false);
      }
    })
  }

  return (
    <div>
      <div className="flex justify-between relative">
        <div className="flex items-center text-gray-700 mb-2">
          <img src={`https://ui-avatars.com/api/?name=${profileName.slice(-1)}`} alt="avatar" className="w-[32px] h-[32px] rounded-full mr-3" />
          <div>{profileName}</div>
          <div className="text-18 text-blue-400 ml-3 cursor-pointer" onClick={() => {
            state.showProfileEditorModal = true;
          }}>
            <AiOutlineEdit />
          </div>
          <ProfileEditorDialog
            open={state.showProfileEditorModal}
            onClose={() => {
              state.showProfileEditorModal = false;
            }}
            profile={null}
            onProfileChanged={onProfileChanged}
          />
        </div>
      </div>
      <TextField
        className="w-full"
        placeholder="What's happening?"
        size="small"
        multiline
        minRows={3}
        value={state.content}
        onChange={(e) => { state.content = e.target.value; }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && state.content.trim()) {
            submitPost(state.content.trim());
            e.preventDefault();
          }
        }}
        margin="dense"
        variant="outlined"
        type="memo"
      />

      <div className="mt-5">
        {state.ids.map((id) => (
          <div key={id}>
            <PostItem 
              post={state.postMap[id]}
              onPostEdit={(content) => {
                onPostEdit(id, content)
              }}
              onPostChanged={onPostChanged}
              onDeletePost={() => {
                onPostDelete(id)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
});
