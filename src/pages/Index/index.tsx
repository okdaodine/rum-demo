import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Feed from './Feed';
import { SummaryApi } from 'apis';
import { ISummary } from 'apis/types';
import { API_BASE_URL } from 'apis/common';
import sleep from 'utils/sleep';
import { AiOutlineGithub } from 'react-icons/ai';

export default observer(() => {
  const state = useLocalObservable(() => ({
    summary: {
      post: 0,
      content: 0,
      like: 0,
      comment: 0,
      profile: 0,
    } as ISummary
  }));

  React.useEffect(() => {
    (async () => {
      while(true) {
        try {
          state.summary = await SummaryApi.get();
        } catch (err) {
          console.log(err);
        }
        await sleep(5000);
      }
    })();
  }, []);

  return (
    <div className="mt-10 w-[600px] mx-auto">
      <Feed />
      <div className="fixed bottom-10 right-10">
        <a className="mt-5 p-3 text-gray-70 text-13 cursor-pointer" target="_blank" rel="noreferrer" href="https://github.com/okdaodine/rum-demo">
          <AiOutlineGithub className="text-46" />
        </a>
      </div>

      <div className="fixed top-[20vh] right-10 z-10 border rounded-12 border-gray-70">
        <div className="font-bold opacity-70 border-b border-gray-400 py-3 px-4">已同步的数据</div>
        <div className="pt-2 p-4">
          <div className="text-stone-600 mt-3">
            post <span className="text-16 font-bold">{state.summary.post}</span> 条<a href={`${API_BASE_URL}/posts?raw=true`} target="_blank" rel="noreferrer" className="text-sky-500 text-12 ml-2">查看</a>
          </div>
          <div className="text-stone-600 mt-2">
            like <span className="text-16 font-bold">{state.summary.like}</span> 条<a href={`${API_BASE_URL}/likes?raw=true`} target="_blank" rel="noreferrer" className="text-sky-500 text-12 ml-2">查看</a>
          </div>
          <div className="text-stone-600 mt-2">
            comment <span className="text-16 font-bold">{state.summary.comment}</span> 条<a href={`${API_BASE_URL}/comments?raw=true`} target="_blank" rel="noreferrer" className="text-sky-500 text-12 ml-2">查看</a>
          </div>
          <div className="text-stone-600 mt-2">
            profile <span className="text-16 font-bold">{state.summary.profile}</span> 条<a href={`${API_BASE_URL}/profiles?raw=true`} target="_blank" rel="noreferrer" className="text-sky-500 text-12 ml-2">查看</a>
          </div>
          <div className="border-t border-gray-400 mt-4 pt-2"></div>
          <div className="pt-1 text-stone-600">
            全部 <span className="text-16 font-bold">{state.summary.content}</span> 条<a href={`${API_BASE_URL}/contents?raw=true`} target="_blank" rel="noreferrer" className="text-sky-500 text-12 ml-2">查看</a>
          </div>
        </div>
      </div>
    </div>
  )
});

