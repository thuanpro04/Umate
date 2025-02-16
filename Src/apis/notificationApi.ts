import axiosClient from './axiosClients';

class notificationApi {
  handleNotification = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put',
  ) => {
    return await axiosClient(`/notification${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const notificationAPI = new notificationApi();
export default notificationAPI;
