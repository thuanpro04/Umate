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
export const userServices = {
  getEquestFriendUsers,
  updateUsersById,
};
