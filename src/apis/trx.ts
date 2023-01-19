import request from 'request';
import { API_BASE_URL } from './common';
import { IActivity, ITrx, utils } from 'rum-sdk-browser';
import store from 'store2';

export default {
  async createActivity(activity: IActivity) {
    const group = utils.restoreSeedFromUrl(store('seedUrl'));
    const payload = await utils.signTrx({
      data: activity,
      groupId: group.group_id,
      aesKey: group.cipher_key,
      privateKey: store('privateKey'),
    });
    console.log(payload);
    const res: { trx_id: string } = await request(`${API_BASE_URL}/trx`, {
      method: 'POST',
      body: payload
    });
    return res;
  },

  async get(trxId: string) {
    const res: ITrx = await request(`${API_BASE_URL}/trx/${trxId}`);
    return res;
  }
}
