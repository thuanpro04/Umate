import axiosClient from './axiosClients';

class postApi {
  handlePost = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put',
  ) => {
    return await axiosClient(`/post-api${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const postAPI = new postApi();
export default postAPI;
