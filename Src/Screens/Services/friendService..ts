import {useSelector} from 'react-redux';
import usersAPI from '../../apis/usersApi';
import {userServices} from './userService';
import {authSelector} from '../../redux/reducers/authReducer';

const handlePressRemoveSuggested = async (
  usersID: string,
  currentUserID: string,
) => {
  const url = '/remove-suggested-friend';
  const data = {friendUserID: usersID, currentUserID};
  const res = await userServices.getUsers(url, data, 'post');
  console.log(res);
  return res?.data;
};
const handleRemoveFriends = async (usersID: string, currentUserID: string) => {
  const url = '/remove-friend';
  const data = {friendUserID: usersID, currentUserID};
  const res = await userServices.getUsers(url, data, 'post');
  return res?.data;
};
const handleFriendActionAdd_Cancel = async (
  friendUserID: string,
  action: 'add' | 'cancel',
  currentUserID: string,
) => {
  const enpoint = action === 'add' ? '/add-friend' : '/cancel-friend';
  const data = {friendUserID, currentUserID};
  console.log('data', data);

  try {
    const res = await usersAPI.handleUsers(enpoint, data, 'post');
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
