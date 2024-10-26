import axiosClient from './axiosClients';

class searchApi {
  handleSearch = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put',
  ) => {
    return await axiosClient(`/api${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const searchAPI = new searchApi();
export default searchAPI;
