import usersAPI from '../../apis/usersApi';

// Giả sử đây là nơi bạn thực hiện các yêu cầu API
const getUsers = async (url: string, data?: any, method?: 'get' | 'post') => {
  const res = await usersAPI.handleUsers(url, data, method ?? 'get');
  return res?.data;
};

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
export const userServices = {
  getUsers,
  getEquestFriendUsers,
  updateUsersById,
};
