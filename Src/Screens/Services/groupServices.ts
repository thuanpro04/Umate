import groupAPI from '../../apis/groupApi';
let url;
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
const handleAgreeOnGroup = async (
  userId: string,
  id: string,
  groupId?: string,
) => {
  url = '/agree';
  const data = {
    userId,
    id,
    groupId,
  };
  const res = await groupAPI.handleGroup(url, data, 'post');
  return res;
};
const handleOutGroup = async (userId: string, groupId: string) => {
  url = `/out-group?id=${groupId}&&userId=${userId}`;
  const res = await groupAPI.handleGroup(url);
  return res;
};
const handlePosition = async (
  userId: string,
  groupId: string,
  position?: string,
) => {
  url = `/position`;
  const data = {
    id: groupId,
    userId,
    position,
  };
  const res = await groupAPI.handleGroup(url, data, 'post');
  return res;
};
export const groupServices = {
  handelNewGroupUser,
  handleAgreeOnGroup,
  handleOutGroup,
  handlePosition,
};
