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
const getMyPost = async (id: string, currentId: string) => {
  url = `/my-post?id=${id}&&currentId=${currentId}`;
  try {
    const res = await postAPI.handlePost(url);
    return res;
  } catch (error) {
    console.log('My post error: ', error);
  }
};
const handleRemovePost = async (id: string) => {
  url = `/remove/${id}`;
  try {
    const res = await postAPI.handlePost(url);
    return res;
  } catch (error) {
    console.log('Remove post error: ', error);
  }
};
const handleRemovePostShare = async (id: string, userId: string) => {
  url = `/remove-share?id=${id}&&userId=${userId}`;
  try {
    const res = await postAPI.handlePost(url);
    return res;
  } catch (error) {
    console.log('Remove post share error: ', error);
  }
};
const handleHidePost = async (userId: string, postId: string, key?: string) => {
  url = '/hide';
  try {
    const res = await postAPI.handlePost(url, {userId, postId, key}, 'post');
    return res;
  } catch (error) {
    console.log('Hide post error: ', error);
  }
};
const handleUpdatePrivacy = async (postId: string, privacy: string) => {
  url = '/u-privacy';
  try {
    const res = await postAPI.handlePost(url, {postId, privacy}, 'post');
    return res;
  } catch (error) {
    console.log('Update privacy error: ', error);
  }
};
const handleCreateComment = async (data: any) => {
  try {
    url = '/create';
    const res = await postAPI.handlePost(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Create comment error: ', error);
  }
};
const getCommentForUser = async (postId: string) => {
  url = `/comments?id=${postId}`;
  try {
    const res = await postAPI.handlePost(url);
    return res;
  } catch (error) {
    console.log('Get comment error: ', error);
  }
};
const handleReplyComment = async (data: any) => {
  try {
    url = '/r-comment';
    const res = await postAPI.handlePost(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Repy error: ', error);
  }
};
export const postServices = {
  handleMyPost,
  getEventForUser,
  handleLikePost,
  getMyPost,
  handleRemovePost,
  handleRemovePostShare,
  handleHidePost,
  handleUpdatePrivacy,
  handleCreateComment,
  getCommentForUser,
  handleReplyComment,
};
