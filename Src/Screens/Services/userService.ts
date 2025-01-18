import usersAPI from '../../apis/usersApi';

const getEquestFriendUsers = async (currentUserId: string, filter?: string) => {
  const url = `/get-all?currentUserId=${currentUserId}&filter=${filter}`;

  const res = await usersAPI.handleUsers(url);
  return res?.data;
};
const updateUsersById = async (userInfo: any) => {
  const url = `/update-users`;
  const res = await usersAPI.handleUsers(url, userInfo, 'post');
  return res;
};
const getUserInfo = async (userId: string) => {
  const url = `/get-user?userId=${userId}`;
  try {
    const res = await usersAPI.handleUsers(url);
    console.log(url);
    
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
