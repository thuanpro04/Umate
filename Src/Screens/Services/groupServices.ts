import groupAPI from '../../apis/groupApi';

const handelNewGroupUser = async (
  data: any,
  method?: 'get' | 'post' | 'put',
) => {
  try {
    const res = await groupAPI.handleGroup('/new-group', data, method);
    return res;
  } catch (error) {
    console.log('handelNewGroupUser', error);
  }
  return null;
};
export const groupServices = {handelNewGroupUser};
