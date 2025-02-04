import usersAPI from '../../apis/usersApi';
let url;
const getEquestFriendUsers = async (currentUserId: string, filter?: string) => {
  url = `/get-all?currentUserId=${currentUserId}&filter=${filter}`;

  const res = await usersAPI.handleUsers(url);
  return res?.data;
};
const updateUsersById = async (userInfo: any) => {
  url = `/update-users`;
  const res = await usersAPI.handleUsers(url, userInfo, 'post');
  return res;
};
const getUserInfo = async (userId: string) => {
  url = `/get-user?userId=${userId}`;
  try {
    const res = await usersAPI.handleUsers(url);
    console.log(url);

    return res;
  } catch (error) {
    console.log('fail get user info error ', error);
  }
};
const getListUserInfo = async (listUsers: string[]) => {
  url = '/get-list-user';
  const res = await usersAPI.handleUsers(url, listUsers, 'post');
  return res;
};
export const userServices = {
  getEquestFriendUsers,
  updateUsersById,
  getUserInfo,
  getListUserInfo
};
