import axiosClient from './axiosClients';

class EventAPI {
  handleEvent = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put',
  ) => {
    return await axiosClient(`/events-api${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const eventApi = new EventAPI();
export default eventApi;
