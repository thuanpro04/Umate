import usersAPI from '../../apis/usersApi';

const getEquestFriendUsers = async (currentUserID: string, filter: string) => {
  const url = `/get-all?currentUserID=${currentUserID}&filter=${filter}`;

  const res = await usersAPI.handleUsers(url);
  return res?.data;
};
const updateUsersById = async (userInfo: any) => {
  const url = `/update-users`;
  const res = await usersAPI.handleUsers(url, userInfo, 'post');
  return res;
};
const getUserInfo = async (userID: string) => {
  const url = `/get-user?userID=${userID}`;
  try {
    const res = await usersAPI.handleUsers(url);
    return res;
  } catch (error) {
    console.log('fail get user info error ', error);
  }
};
export const userServices = {
  getEquestFriendUsers,
  updateUsersById,
  getUserInfo,
};
