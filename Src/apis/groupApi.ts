import axiosClient from './axiosClients';

class groupApi {
  handleGroup = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put',
  ) => {
    return await axiosClient(`/group-api${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const groupAPI = new groupApi();
export default groupAPI;
