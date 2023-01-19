import request from 'request';
import { API_BASE_URL } from './common';
import { IPost } from './types';
import qs from 'query-string';

export default {
  async list(options: {
    viewer?: string
    offset?: number
    limit?: number
  } = {}) {
    const items: IPost[] = await request(`${API_BASE_URL}/posts?${qs.stringify(options)}`);
    return items;
  }
}