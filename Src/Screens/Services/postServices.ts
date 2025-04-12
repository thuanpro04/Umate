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
  
  console.log(url);

  try {
    const res = await postAPI.handlePost(url);
    return res;
  } catch (error) {
    console.log('get event fail: ', error);
  }
};
const handleLikePost = async (userId: string, id: string) => {
  url = '/like';
  try {
    const res = await postAPI.handlePost(url, {userId, id}, 'post');
    return res;
  } catch (error) {
    console.log('Like post error: ', error);
  }
};
export const postServices = {
  handleMyPost,
  getEventForUser,
  handleLikePost,
};
