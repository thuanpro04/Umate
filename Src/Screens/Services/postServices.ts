import postAPI from '../../apis/postApi';
let url;
const handleMyPost = async (data: any) => {
  url = '/event';
  try {
    const res = await postAPI.handlePost(url, data, 'post');
    return res;
  } catch (error) {
    console.log('My post error: ', error);
  }
};
const getEventForUser = async (page: number, userId: string) => {
  url = `/get-event?id=${userId}&&page=${page}`;
console.log(url);

  try {
    const res = await postAPI.handlePost(url);
    return res;
  } catch (error) {
    console.log('get event fail: ', error);
  }
};
export const postServices = {
  handleMyPost,
  getEventForUser,
};
