import {useSelector} from 'react-redux';
import usersAPI from '../../apis/usersApi';
import {userServices} from './userService';
import {authSelector} from '../../redux/reducers/authReducer';
import friendsAPI from '../../apis/friendsApi';

const handlePressRemoveSuggested = async (
  usersID: string,
  currentUserID: string,
) => {
  const url = '/remove-suggested';
  const data = {friendUserID: usersID, currentUserID};
  const res = await friendsAPI.handleFriendsApi(url, data, 'post');
  console.log(res);
  return res?.data;
};
const handleRemoveFriends = async (usersID: string, currentUserID: string) => {
  const url = '/remove';
  const data = {friendUserID: usersID, currentUserID};
  const res = await friendsAPI.handleFriendsApi(url, data, 'post');
  return res?.data;
};
const handleFriendActionAdd_Cancel = async (
  friendUserID: string,
  action: 'add' | 'cancel',
  currentUserID: string,
) => {
  const enpoint = action === 'add' ? '/add' : '/cancel';
  const data = {friendUserID, currentUserID};

  try {
    const res = await friendsAPI.handleFriendsApi(enpoint, data, 'post');
    return res;
  } catch (error) {
    console.log('HandleFriendActionAdd_Cancel', error);
  }
};
export const friendServices = {
  handlePressRemoveSuggested,
  handleRemoveFriends,
  handleFriendActionAdd_Cancel,
};
