import {useSelector} from 'react-redux';
import usersAPI from '../../apis/usersApi';
import {userServices} from './userService';
import {authSelector} from '../../redux/reducers/authReducer';
import friendsAPI from '../../apis/friendsApi';

const handlePressRemoveSuggested = async (
  userId: string,
  currentUserId: string,
) => {
  const url = '/remove-suggested';
  const data = {friendUserId: userId, currentUserId};
  const res = await friendsAPI.handleFriendsApi(url, data, 'post');

  return res?.data;
};
const handlePressRemoveRequest = async (
  userId: string,
  currentUserId: string,
) => {
  const url = '/remove-request';
  const data = {friendUserId: userId, currentUserId};
  const res = await friendsAPI.handleFriendsApi(url, data, 'post');

  return res?.data;
};
const handleRemoveFriends = async (userId: string, currentUserId: string) => {
  const url = '/remove';
  const data = {friendUserId: userId, currentUserId};
  const res = await friendsAPI.handleFriendsApi(url, data, 'post');
  return res?.data;
};
const handleFriendActionAdd_Cancel = async (
  friendUserId: string,
  action: 'add' | 'cancel',
  currentUserId: string,
) => {
  const enpoint = action === 'add' ? '/add' : '/cancel';
  const data = {friendUserId, currentUserId};

  try {
    const res = await friendsAPI.handleFriendsApi(enpoint, data, 'post');
    return res;
  } catch (error) {
    console.log('HandleFriendActionAdd_Cancel', error);
  }
};
const handleAgreeFriendShip = async (
  currentUserId: string,
  friendUserId: string,
) => {
  const url = `/agree`;
  const data = {currentUserId, friendUserId};
  const res = await friendsAPI.handleFriendsApi(url, data, 'post');
  return res;
};
export const friendServices = {
  handlePressRemoveSuggested,
  handleRemoveFriends,
  handleFriendActionAdd_Cancel,
  handlePressRemoveRequest,
  handleAgreeFriendShip,
};
