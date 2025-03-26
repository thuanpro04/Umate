import usersAPI from '../../apis/usersApi';
let url: string;
const getEquestFriendUsers = async (
  currentUserId: string,
  filter?: string,
  page?: number,
) => {
  try {
    url = `/get-all`;
    const data = {
      currentUserId,
      filter,
      page,
    };
    const res = await usersAPI.handleUsers(url, data, 'post');
    return res;
  } catch (error) {
    console.error('Post event get users failed', error);
  }
};
const updateUsersById = async (userInfo: any) => {
  try {
    url = `/update-users`;
    const res = await usersAPI.handleUsers(url, userInfo, 'post');
    return res;
  } catch (error) {
    console.log('Set up profile failed', error);
  }
};
const getUserInfo = async (userId: string) => {
  url = `/get-user?userId=${userId}`;
  try {
    const res = await usersAPI.handleUsers(url);
    return res;
  } catch (error) {
    console.log('fail get user info error ', error);
  }
};
const getListUserInfo = async (listUsers: string[]) => {
  try {
    url = '/get-list-user';
    const res = await usersAPI.handleUsers(url, listUsers, 'post');
    return res;
  } catch (error) {
    console.log('Friend get all user fail: ', error);
  }
};
const updateUserStatus = async (userId: string, status: Boolean) => {
  try {
    url = `/update-status?id=${userId}&status=${status}`;
    const res = await usersAPI.handleUsers(url);
    return res;
  } catch (error) {
    console.log('update status fail: ', error);
  }
};
const updateBlockUser = async (userId: string, userFriendId: string) => {
  try {
    const data = {
      userId,
      userFriendId,
    };
    url = '/block-user';
    const res = await usersAPI.handleUsers(url, data, 'post');
    return res;
  } catch (error) {
    console.log('handle block user fail: ', error);
  }
};
const updateThemeforUser = async (userId: string, theme: string) => {
  try {
    url = '/update-theme';
    const data = {
      userId,
      theme,
    };
    const res = await usersAPI.handleUsers(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Update state theme error: ', error);
  }
};
const handleRemoveUser = async (userId: string) => {
  try {
    url = `/remove-user?id=${userId}`;
    const res = usersAPI.handleUsers(url);
    return res;
  } catch (error) {
    console.log('handle remove user fail: ', error);
  }
};
const updateLanguage = async (id: string, key: string) => {
  url = '/update-language';
  const res = usersAPI.handleUsers(url, {id, key}, 'post');
  return res;
};
export const userServices = {
  getEquestFriendUsers,
  updateUsersById,
  getUserInfo,
  getListUserInfo,
  updateUserStatus,
  updateBlockUser,
  updateThemeforUser,
  handleRemoveUser,
  updateLanguage,
};
