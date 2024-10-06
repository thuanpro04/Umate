import usersAPI from '../../apis/usersApi';

const getUsers = async (url: string, data?: any, method?: 'get' | 'post') => {
  const res = await usersAPI.handleUsers(url, data, method ?? 'get');
  return res?.data;
};
export const Users = {
  getUsers,
};
