import {useSelector} from 'react-redux';
import usersAPI from '../../apis/usersApi';
import {userServices} from './userService';
import {authSelector} from '../../redux/reducers/authReducer';
import friendsAPI from '../../apis/friendsApi';

const handlePressRemoveSuggested = async (
  userId: string,
  currentUserId: string,
) => {
  try {
    const url = '/remove-suggested';
    const data = {friendUserId: userId, currentUserId};
    const res = await friendsAPI.handleFriendsApi(url, data, 'post');
    return res;
  } catch (error) {
    console.log('handlePressRemove error', error);
  }
};
const handlePressRemoveRequest = async (
  userId: string,
  currentUserId: string,
) => {
  try {
    const url = '/remove-request';
    const data = {friendUserId: userId, currentUserId};
    const res = await friendsAPI.handleFriendsApi(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Request remove friend fail: ', error);
  }
};
const handleRemoveFriends = async (userId: string, currentUserId: string) => {
  try {
    const url = '/remove';
    const data = {friendUserId: userId, currentUserId};
    const res = await friendsAPI.handleFriendsApi(url, data, 'post');
    return res;
  } catch (error) {
    console.log('handleRemoveFriends error', error);
  }
};
const handleFriendActionAdd_Cancel = async (
  friendUserId: string,
  action: 'add' | 'cancel',
  currentUserId: string,
) => {
  try {
    const enpoint = action === 'add' ? '/add' : '/cancel';
    const data = {friendUserId, currentUserId};
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
  try {
    const url = `/agree`;
    const data = {currentUserId, friendUserId};
    const res = await friendsAPI.handleFriendsApi(url, data, 'post');
    return res;
  } catch (error) {
    console.log('FriendsRequestScreen', error);
  }
};
export const friendServices = {
  handlePressRemoveSuggested,
  handleRemoveFriends,
  handleFriendActionAdd_Cancel,
  handlePressRemoveRequest,
  handleAgreeFriendShip,
};
