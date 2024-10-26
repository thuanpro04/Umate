import axiosClient from './axiosClients';

class friendsApi {
  handleFriendsApi = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put',
  ) => {
    return await axiosClient(`/api-friends${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const friendsAPI = new friendsApi();
export default friendsAPI;
