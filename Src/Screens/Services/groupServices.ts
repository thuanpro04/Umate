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
  try {
    url = '/agree';
    const data = {
      userId,
      id,
      groupId,
    };
    const res = await groupAPI.handleGroup(url, data, 'post');
    return res;
  } catch (error) {
    console.log('action friend error: ', error);
  }
};
const handleOutGroup = async (userId: string, groupId: string) => {
  try {
    url = `/out-group?id=${groupId}&&userId=${userId}`;

    const res = await groupAPI.handleGroup(url);
    return res;
  } catch (error) {
    console.log('out group error: ', error);
  }
};
const handlePosition = async (
  userId: string,
  groupId: string,
  position?: string,
) => {
  try {
    url = `/position`;
    const data = {
      id: groupId,
      userId,
      position,
    };
    const res = await groupAPI.handleGroup(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Position error: ', error);
  }
};
const updateAttendedGroup = async (data: any) => {
  try {
    url = '/update-attend';
    const res = await groupAPI.handleGroup(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Atteded group error: ', error);
  }
};
const handleEditGroupName = async (id: string, groupName: string) => {
  try {
    url = `/edit-name?id=${id}&&name=${groupName.trim()}`;
    console.log(url);

    const res = await groupAPI.handleGroup(url);
    return res;
  } catch (error) {
    console.log('edit group name error: ', error);
  }
};
const uploadAvatarGroup = async (id: string, urlImg: string) => {
  url = '/upload-avatar';
  try {
    const res = await groupAPI.handleGroup(url, {id, urlImg}, 'post');
    return res;
  } catch (error) {
    console.log('Upload avatar error: ', error);
  }
};
export const groupServices = {
  handelNewGroupUser,
  handleAgreeOnGroup,
  handleOutGroup,
  handlePosition,
  updateAttendedGroup,
  handleEditGroupName,
  uploadAvatarGroup,
};
