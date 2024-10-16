import axiosClient from './axiosClients';

class chatsApi {
  handleChats = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put',
  ) => {
    return await axiosClient(`/chats${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const chatsAPI = new chatsApi();
export default chatsAPI;
