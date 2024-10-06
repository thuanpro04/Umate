import axiosClient from './axiosClients';

class UsersApi {
  handleUsers = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/users${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const usersAPI = new UsersApi();
export default usersAPI;
