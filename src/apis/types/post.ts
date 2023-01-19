import { IProfile } from './profile';
import { TrxStorage } from '../common';

export interface IPost {
  trxId: string
  id: string
  content: string
  userAddress: string
  timestamp: number
  storage?: TrxStorage
  extra: IPostExtra
}

export interface IPostExtra {
  profile?: IProfile
  liked?: boolean
  likeCount: number
  commentCount: number
}