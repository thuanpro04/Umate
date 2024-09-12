import axiosClient from './axiosClients';

class AuthApi {
  handleAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/auth${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}
const authenticationApi= new AuthApi();
export default authenticationApi;
