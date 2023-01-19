import request from 'request';
import { API_BASE_URL } from './common';
import { ISummary } from './types';

export default {
  async get() {
    const item: ISummary = await request(`${API_BASE_URL}/summary`);
    return item;
  }
}