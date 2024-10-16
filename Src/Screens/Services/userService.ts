import usersAPI from "../../apis/usersApi";

 // Giả sử đây là nơi bạn thực hiện các yêu cầu API
const getUsers = async (url: string, data?: any, method?: 'get' | 'post') => {
  const res = await usersAPI.handleUsers(url, data, method ?? 'get');
  return res?.data;
};


export const userServices = {
  getUsers
};
